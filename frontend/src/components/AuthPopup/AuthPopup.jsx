import { useEffect, useRef, useState } from "react";

import {
  AUTH_POPUP_EYEBROW,
  AUTH_POPUP_CONTENT,
  AUTH_POPUP_FIELDS,
  AUTH_POPUP_CLOSE_LABEL,
  AUTH_VALIDATION_MESSAGES,
} from "./data";

import "./AuthPopup.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MIN_NAME_LENGTH = 2;

function validateField(name, value) {
  if (name === "name") {
    if (!value.trim()) return AUTH_VALIDATION_MESSAGES.nameRequired;
    if (value.trim().length < MIN_NAME_LENGTH) {
      return AUTH_VALIDATION_MESSAGES.nameTooShort;
    }
    return "";
  }

  if (name === "email") {
    if (!value.trim()) return AUTH_VALIDATION_MESSAGES.emailRequired;
    if (!EMAIL_REGEX.test(value.trim())) {
      return AUTH_VALIDATION_MESSAGES.emailInvalid;
    }
    return "";
  }

  if (name === "password") {
    if (!value) return AUTH_VALIDATION_MESSAGES.passwordRequired;
    if (value.length < MIN_PASSWORD_LENGTH) {
      return AUTH_VALIDATION_MESSAGES.passwordTooShort;
    }
    return "";
  }

  return "";
}

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
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false,
  });
  const firstInputRef = useRef(null);

  const content = AUTH_POPUP_CONTENT[mode];
  const isSignup = mode === "signup";
  const passwordField = isSignup
    ? AUTH_POPUP_FIELDS.passwordSignup
    : AUTH_POPUP_FIELDS.passwordSignin;

  const errors = {
    name: isSignup ? validateField("name", formValues.name) : "",
    email: validateField("email", formValues.email),
    password: validateField("password", formValues.password),
  };

  const hasErrors = Object.values(errors).some((error) => error !== "");

  useEffect(() => {
    if (isOpen) {
      setFormValues({ name: "", email: "", password: "" });
      setTouchedFields({ name: false, email: false, password: false });
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

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouchedFields((previous) => ({ ...previous, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setTouchedFields({ name: true, email: true, password: true });

    if (hasErrors) return;

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

  const renderError = (fieldName) => {
    if (!touchedFields[fieldName] || !errors[fieldName]) return null;
    return (
      <span className="modal__error" role="alert">
        {errors[fieldName]}
      </span>
    );
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

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div className="modal__field">
              <label htmlFor="auth-name" className="modal__label">
                {AUTH_POPUP_FIELDS.name.label}
              </label>
              <input
                id="auth-name"
                name="name"
                type="text"
                className={
                  touchedFields.name && errors.name
                    ? "modal__input modal__input--invalid"
                    : "modal__input"
                }
                placeholder={AUTH_POPUP_FIELDS.name.placeholder}
                autoComplete={AUTH_POPUP_FIELDS.name.autoComplete}
                value={formValues.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touchedFields.name && errors.name)}
                aria-describedby={
                  touchedFields.name && errors.name ? "auth-name-error" : null
                }
                required
                ref={firstInputRef}
              />
              {renderError("name") && (
                <span id="auth-name-error">{renderError("name")}</span>
              )}
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
              className={
                touchedFields.email && errors.email
                  ? "modal__input modal__input--invalid"
                  : "modal__input"
              }
              placeholder={AUTH_POPUP_FIELDS.email.placeholder}
              autoComplete={AUTH_POPUP_FIELDS.email.autoComplete}
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(touchedFields.email && errors.email)}
              aria-describedby={
                touchedFields.email && errors.email ? "auth-email-error" : null
              }
              required
              ref={isSignup ? null : firstInputRef}
            />
            {renderError("email") && (
              <span id="auth-email-error">{renderError("email")}</span>
            )}
          </div>

          <div className="modal__field">
            <label htmlFor="auth-password" className="modal__label">
              {passwordField.label}
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              className={
                touchedFields.password && errors.password
                  ? "modal__input modal__input--invalid"
                  : "modal__input"
              }
              placeholder={passwordField.placeholder}
              autoComplete={passwordField.autoComplete}
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(touchedFields.password && errors.password)}
              aria-describedby={
                touchedFields.password && errors.password
                  ? "auth-password-error"
                  : null
              }
              required
            />
            {renderError("password") && (
              <span id="auth-password-error">{renderError("password")}</span>
            )}
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
