import { useEffect, useState } from "react";
import Button from "./Button.jsx";
import Icon from "./Icon.jsx";

export default function AddRecordModal({
  title,
  description,
  fields,
  initialValues = {},
  isOpen,
  onClose,
  onSubmit,
  submitIcon = "add",
  submitLabel = "Thêm"
}) {
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    if (isOpen) {
      setFormValues(initialValues);
    }
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  function getFieldOptions(field) {
    if (field.dependsOn) {
      return field.optionMap?.[formValues[field.dependsOn]] ?? [];
    }

    return field.options ?? [];
  }

  function isFieldVisible(field, values = formValues) {
    if (!field.showWhen) return true;
    return values[field.showWhen.field] === field.showWhen.value;
  }

  function handleFieldChange(fieldName, value) {
    setFormValues((currentValues) => {
      const nextValues = { ...currentValues, [fieldName]: value };
      fields
        .filter((field) => field.dependsOn === fieldName)
        .forEach((field) => {
          nextValues[field.name] = "";
        });
      fields
        .filter((field) => !isFieldVisible(field, nextValues))
        .forEach((field) => {
          nextValues[field.name] = "";
        });
      return nextValues;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit?.(formValues);
    onClose();
  }

  function isFieldDisabled(field) {
    return Boolean(field.disabled || field.readOnly || (field.dependsOn && !formValues[field.dependsOn]));
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-record-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="form-modal-header">
          <div>
            <h2 id="add-record-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button className="icon-button modal-close" type="button" aria-label="Đóng" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>

        <form className="form-modal-body" onSubmit={handleSubmit}>
          <div className="form-grid">
            {fields.filter((field) => isFieldVisible(field)).map((field) => (
              <label className="form-field" key={field.name}>
                <span>{field.label}</span>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formValues[field.name] ?? ""}
                    onChange={(event) => handleFieldChange(field.name, event.target.value)}
                    required
                    disabled={isFieldDisabled(field)}
                  >
                    <option value="" disabled>
                      Chọn {field.label.toLowerCase()}
                    </option>
                    {getFieldOptions(field).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    value={formValues[field.name] ?? ""}
                    onChange={(event) => handleFieldChange(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    min={field.type === "number" ? field.min ?? "0" : undefined}
                    max={field.type === "number" ? field.max : undefined}
                    readOnly={Boolean(field.readOnly)}
                    disabled={Boolean(field.disabled)}
                    required={field.required !== false}
                  />
                )}
              </label>
            ))}
          </div>

          <footer className="form-modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" icon={submitIcon}>
              {submitLabel}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
