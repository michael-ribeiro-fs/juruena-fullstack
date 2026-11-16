import { useEffect, useRef, useState } from "react";

import {
  AUTH_POPUP_EYEBROW,
  AUTH_POPUP_CONTENT,
  AUTH_POPUP_FIELDS,
  AUTH_POPUP_CLOSE_LABEL,
} from "./data";

import "./AuthPopup.css";

function AuthPopup({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
  onSubmitSignUp,
  onSubmitSignIn,
}) {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const firstInputRef = useRef(null);

  const content = AUTH_POPUP_CONTENT[mode];
  const isSignup = mode === "signup";
  const passwordField = isSignup
    ? AUTH_POPUP_FIELDS.passwordSignup
    : AUTH_POPUP_FIELDS.passwordSignin;

  useEffect(() => {
    if (isOpen) {
      setFormValues({ name: "", email: "", password: "" });
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSignup) {
      onSubmitSignUp(formValues);
    } else {
      onSubmitSignIn({
        email: formValues.email,
        password: formValues.password,
      });
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-popup-title"
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label={AUTH_POPUP_CLOSE_LABEL}
        >
          <svg
            className="modal__close-icon"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal__header">
          <p className="modal__eyebrow">{AUTH_POPUP_EYEBROW}</p>
          <h2 id="auth-popup-title" className="modal__title">
            {content.title}
          </h2>
          <p className="modal__desc">{content.description}</p>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="modal__field">
              <label htmlFor="auth-name" className="modal__label">
                {AUTH_POPUP_FIELDS.name.label}
              </label>
              <input
                id="auth-name"
                name="name"
                type="text"
                className="modal__input"
                placeholder={AUTH_POPUP_FIELDS.name.placeholder}
                autoComplete={AUTH_POPUP_FIELDS.name.autoComplete}
                value={formValues.name}
                onChange={handleChange}
                minLength={2}
                required
                ref={firstInputRef}
              />
            </div>
          )}

          <div className="modal__field">
            <label htmlFor="auth-email" className="modal__label">
              {AUTH_POPUP_FIELDS.email.label}
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              className="modal__input"
              placeholder={AUTH_POPUP_FIELDS.email.placeholder}
              autoComplete={AUTH_POPUP_FIELDS.email.autoComplete}
              value={formValues.email}
              onChange={handleChange}
              required
              ref={isSignup ? null : firstInputRef}
            />
          </div>

          <div className="modal__field">
            <label htmlFor="auth-password" className="modal__label">
              {passwordField.label}
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              className="modal__input"
              placeholder={passwordField.placeholder}
              autoComplete={passwordField.autoComplete}
              value={formValues.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="modal__submit">
            {content.submitLabel}
          </button>
        </form>

        <button
          type="button"
          className="modal__switch-link"
          onClick={onSwitchMode}
        >
          {content.switchLabel}
        </button>
      </div>
    </div>
  );
}

export default AuthPopup;
