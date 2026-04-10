const { Groq } = require('groq-sdk');
const Product = require('../models/productModel');
const { ok, fail } = require('../utils/responseHelper');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const handleChat = (req, res) => {
    const { message, language } = req.body;
    if (!message || message.trim() === '') {
        return fail(res, 'Message cannot be empty.', 400);
    }

    const cleanMsg = message.toLowerCase().replace(/\b(hello|hi|hey|show|find|buy|me|a|what|do|you|have|about|the|is|there|any)\b/gi, '').trim().split(' ')[0] || '';

    const processChat = async (contextProducts) => {
        try {
            let context = "You are an intelligent and helpful ecommerce assistant for a branded shoes store. Your role: - Help users with questions about shoes, sizes, prices, delivery, and returns. - Provide clear, short, and helpful answers. - Be polite and friendly. Rules: 1. If user asks general questions → explain clearly (DO NOT suggest products). 2. If user asks for recommendations → suggest suitable shoes with short reasons. 3. If user asks about price → give price range or example. 4. If user asks about size → guide them properly (size chart, fitting tips). 5. If user asks about delivery → explain shipping time (e.g., 3–7 days). 6. If user asks about return → explain return policy (easy 7-day return). 7. Do NOT force product recommendations in every reply. 8. Keep answers simple and under 4–5 lines. Tone: - Friendly - Helpful - Professional Extra: - Suggest products only when user shows buying intent (e.g., “best shoes”, “recommend”, “buy”). - If unsure, ask a follow-up question.\n\n";
            
            // Apply language constraints
            if (language === 'hindi') {
                context += "You must respond strictly in Hindi or conversational Hinglish. Be polite, friendly, and use line breaks for readability. Be consistent use Devangiri or transliterate according to users response.\n";
            } else {
                context += "You must respond strictly in English. Be polite, friendly, and use line breaks for readability. Don't write generic blurbs enumerating products.\n";
            }

            // Apply formatting filters
            context += "\nCRITICAL RULE: DO NOT output json objects, complex markdown formatting, or code blocks. If the user asks about specific products, recommend them strictly by appending `[PRODUCTS: id, id]` to the very end of your message. Do not manually list their prices/descriptions in the text. Example: `We have some great running shoes available! [PRODUCTS: 2, 5]`";
            
            if (contextProducts && contextProducts.length > 0) {
                const catalog = contextProducts.map(p => `ID: ${p.id} | ${p.name}: ${p.description} (₹${p.price})`).join("\n");
                context += `\nRelevant store products available in our database:\n${catalog}`;
            }

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: context },
                    { role: "user", content: message }
                ],
                model: "llama-3.1-8b-instant",
            });

            const productList = contextProducts ? contextProducts.map(p => ({
                name: p.name,
                price: `₹${p.price}`,
                desc: p.description
            })) : [];

            let answerText = completion.choices[0]?.message?.content || 'I am sorry, I could not process that request.';
            
            answerText = answerText.replace(/```[\s\S]*?```/g, '').trim();

            let recommendedProducts = [];
            const productRegex = /\[PRODUCTS:\s*([^\]]+)\]/i;
            const match = answerText.match(productRegex);

            if (match) {
                const idString = match[1];
                const recommendedIds = idString.split(',').map(s => parseInt(s.trim())).filter(id => !isNaN(id));
                
                // Strip the tag from the text
                answerText = answerText.replace(productRegex, '').trim();

                // Map to real products
                recommendedProducts = contextProducts.filter(p => recommendedIds.includes(p.id));
            }

            return ok(res, {
                answer: answerText,
                products: recommendedProducts.length > 0 ? recommendedProducts.map(p => ({
                    name: p.name,
                    price: `₹${p.price}`,
                    desc: p.description
                })) : undefined
            }, 'Chat generated successfully.');

        } catch (error) {
            console.error('Groq Error:', error);
            return fail(res, 'AI Service error', 500);
        }
    };

    Product.getAllProducts((err, allProducts) => {
        if (err) {
            console.error('DB Error checking products for chat:', err);
            return fail(res, 'Internal server error', 500);
        }

        // Limit to ~20 products or all available products
        const contextualProducts = allProducts ? allProducts.slice(0, 20) : [];
        processChat(contextualProducts);
    });
};

module.exports = {
    handleChat
};
