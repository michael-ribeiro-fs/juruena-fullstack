import {
  ABOUT_IMAGE_URL,
  ABOUT_IMAGE_ALT,
  ABOUT_IMAGE_CAPTION,
  ABOUT_EYEBROW,
  ABOUT_TITLE,
  ABOUT_PARAGRAPHS,
  ABOUT_LINK_LABEL,
  ABOUT_LINK_HREF,
} from "./data";

import "./About.css";

function About() {
  return (
    <section id="sobre" className="about" aria-labelledby="about-title">
      <div className="about__grid container">
        <div className="about__text-col">
          <p className="about__eyebrow">{ABOUT_EYEBROW}</p>

          <h2 id="about-title" className="about__title">
            {ABOUT_TITLE}
          </h2>

          <div className="about__body">
            {ABOUT_PARAGRAPHS.map((paragraph) => {
              const paragraphClassName = paragraph.isMuted
                ? "about__paragraph about__paragraph--muted"
                : "about__paragraph";

              return (
                <p key={paragraph.id} className={paragraphClassName}>
                  {paragraph.text}
                </p>
              );
            })}
          </div>

          <a
            href={ABOUT_LINK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="about__link"
          >
            <span>{ABOUT_LINK_LABEL}</span>
            <svg
              className="about__link-icon"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div className="about__image-col">
          <div className="about__image-wrap">
            <img
              src={ABOUT_IMAGE_URL}
              alt={ABOUT_IMAGE_ALT}
              className="about__image"
            />
          </div>
          <p className="about__caption">{ABOUT_IMAGE_CAPTION}</p>
        </div>
      </div>
    </section>
  );
}

export default About;
