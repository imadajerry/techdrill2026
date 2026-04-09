import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './StorefrontFooter.module.css'

type SocialIconProps = ComponentPropsWithoutRef<'svg'>

function FacebookIcon(props: SocialIconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: SocialIconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect height="16" rx="4" ry="4" width="16" x="4" y="4" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export default function StorefrontFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <section className={styles.brandColumn}>
            <Link className={styles.brand} to="/">
              TechDrill
            </Link>
            <p className={styles.copy}>
              Premium storefront experiences for sharp product drops, clean
              browsing, and fast customer journeys.
            </p>
            <div className={styles.socialRow}>
              <a
                aria-label="TechDrill on Facebook"
                className={styles.socialLink}
                href="#"
              >
                <FacebookIcon height={16} width={16} />
              </a>
              <a
                aria-label="TechDrill on Instagram"
                className={styles.socialLink}
                href="#"
              >
                <InstagramIcon height={16} width={16} />
              </a>
            </div>
          </section>

          <section className={styles.newsletterColumn}>
            <p className={styles.heading}>Subscribe to our newsletter</p>
            <form className={styles.form}>
              <input
                aria-label="Email address"
                className={styles.input}
                placeholder="Enter Email..."
                type="email"
              />
            </form>
          </section>

          <section className={styles.linksColumn}>
            <p className={styles.heading}>Quick Links</p>
            <nav className={styles.nav}>
              <Link className={styles.navLink} to="/">
                Home
              </Link>
              <Link className={styles.navLink} to="/products">
                Shop
              </Link>
              <Link className={styles.navLink} to="/favourites">
                Collection
              </Link>
              <Link className={styles.navLink} to="/orders">
                Contact
              </Link>
              <Link className={styles.navLink} to="/login">
                Privacy
              </Link>
            </nav>
          </section>
        </div>

        <div className={styles.bottom}>
          <div className={styles.rule} />
          <p className={styles.copyright}>techdrill.com@allrightreserve</p>
        </div>
      </div>
    </footer>
  )
}
