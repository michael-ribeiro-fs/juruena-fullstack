import { useState } from "react";

import {
  PLACE_FORM_TAGS,
  PLACE_FORM_LABELS,
  PLACE_FORM_PLACEHOLDERS,
  PLACE_FORM_SUBMIT_LABEL,
  PLACE_FORM_SUBMITTING_LABEL,
} from "./data";

import "./PlaceForm.css";

const INITIAL_VALUES = {
  slug: "",
  image: "",
  alt: "",
  tag: PLACE_FORM_TAGS[0],
  location: "",
  title: "",
  description: "",
};

function PlaceForm({ onSubmit }) {
  const [formValues, setFormValues] = useState(INITIAL_VALUES);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    onSubmit(formValues)
      .then(() => {
        setFormValues(INITIAL_VALUES);
      })
      .catch((error) => {
        setFormError(error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form className="place-form" onSubmit={handleSubmit}>
      <div className="place-form__field">
        <label htmlFor="place-title" className="place-form__label">
          {PLACE_FORM_LABELS.title}
        </label>
        <input
          id="place-title"
          name="title"
          type="text"
          className="place-form__input"
          placeholder={PLACE_FORM_PLACEHOLDERS.title}
          value={formValues.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="place-form__field">
        <label htmlFor="place-slug" className="place-form__label">
          {PLACE_FORM_LABELS.slug}
        </label>
        <input
          id="place-slug"
          name="slug"
          type="text"
          className="place-form__input"
          placeholder={PLACE_FORM_PLACEHOLDERS.slug}
          value={formValues.slug}
          onChange={handleChange}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          required
        />
      </div>

      <div className="place-form__field">
        <label htmlFor="place-image" className="place-form__label">
          {PLACE_FORM_LABELS.image}
        </label>
        <input
          id="place-image"
          name="image"
          type="url"
          className="place-form__input"
          placeholder={PLACE_FORM_PLACEHOLDERS.image}
          value={formValues.image}
          onChange={handleChange}
          required
        />
      </div>

      <div className="place-form__field">
        <label htmlFor="place-alt" className="place-form__label">
          {PLACE_FORM_LABELS.alt}
        </label>
        <input
          id="place-alt"
          name="alt"
          type="text"
          className="place-form__input"
          placeholder={PLACE_FORM_PLACEHOLDERS.alt}
          value={formValues.alt}
          onChange={handleChange}
          required
        />
      </div>

      <div className="place-form__field">
        <label htmlFor="place-tag" className="place-form__label">
          {PLACE_FORM_LABELS.tag}
        </label>
        <select
          id="place-tag"
          name="tag"
          className="place-form__select"
          value={formValues.tag}
          onChange={handleChange}
          required
        >
          {PLACE_FORM_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="place-form__field">
        <label htmlFor="place-location" className="place-form__label">
          {PLACE_FORM_LABELS.location}
        </label>
        <input
          id="place-location"
          name="location"
          type="text"
          className="place-form__input"
          placeholder={PLACE_FORM_PLACEHOLDERS.location}
          value={formValues.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="place-form__field place-form__field--full">
        <label htmlFor="place-description" className="place-form__label">
          {PLACE_FORM_LABELS.description}
        </label>
        <textarea
          id="place-description"
          name="description"
          className="place-form__textarea"
          placeholder={PLACE_FORM_PLACEHOLDERS.description}
          value={formValues.description}
          onChange={handleChange}
          minLength={10}
          maxLength={500}
          rows={4}
          required
        />
      </div>

      {formError && (
        <p className="place-form__error" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        className="place-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? PLACE_FORM_SUBMITTING_LABEL : PLACE_FORM_SUBMIT_LABEL}
      </button>
    </form>
  );
}

export default PlaceForm;
