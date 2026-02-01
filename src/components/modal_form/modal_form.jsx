import "./modal_form.css";

export default function ModalForm({
  isOpen,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onClose,
  submitLabel,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <form onSubmit={onSubmit}>
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={values[field.name] ?? ""}
                  onChange={onChange}
                  required={field.required}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  step={field.step}
                  value={values[field.name] ?? ""}
                  onChange={onChange}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {submitLabel}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
