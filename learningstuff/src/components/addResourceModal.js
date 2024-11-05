import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, set, update } from "firebase/database";

export default function AddResourceModal({ onClose, existingResource }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  const [fields, setFields] = useState([
    { name: "title", value: "" },
    { name: "description", value: "" },
  ]);

  useEffect(() => {
    if (existingResource) {
      setContent(existingResource.content);
      setType(existingResource.type || "text");
      setFields([
        { name: "title", value: existingResource.title || "" },
        { name: "description", value: existingResource.description || "" },
      ]);
    }
  }, [existingResource]);

  const handleFieldChange = (index, value) => {
    const newFields = [...fields];
    newFields[index].value = value;
    setFields(newFields);
  };

  const handleAddResource = async () => {
    const fieldData = fields.reduce((acc, field) => {
      if (field.name) acc[field.name] = field.value;
      return acc;
    }, {});

    if (existingResource) {
      const resourceRef = ref(db, `resources/${existingResource.id}`);
      await update(resourceRef, {
        content,
        type,
        ...fieldData,
      });
    } else {
      const newResourceRef = push(ref(db, "resources"));
      await set(newResourceRef, {
        content,
        type,
        ...fieldData,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          {existingResource ? "Edit Resource" : "Add New Resource"}
        </h2>

        <select
          className="w-full mb-3 p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="image">Image URL</option>
          <option value="link">Link</option>
          <option value="video">Video URL</option>
        </select>

        <textarea
          placeholder="Enter main content"
          className="w-full mb-4 p-2 border rounded h-40 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ whiteSpace: "pre-wrap" }} // Preserve line breaks
        />

        {fields.map((field, index) => (
          <div key={index} className="mb-3">
            <input
              type="text"
              placeholder="Field Name"
              className="w-full p-2 border rounded mb-1"
              value={field.name}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[index].name = e.target.value;
                setFields(newFields);
              }}
            />
            {field.name.toLowerCase() === "title" ||
            field.name.toLowerCase() === "subtitle" ? (
              <input
                type="text"
                placeholder="Field Value"
                className="w-full p-2 border rounded"
                value={field.value}
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
            ) : (
              <textarea
                placeholder="Field Value"
                className="w-full p-2 border rounded h-24 resize-none"
                value={field.value}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                style={{ whiteSpace: "pre-wrap" }}
              />
            )}
          </div>
        ))}

        <button
          className="text-blue-600 w-full mb-4"
          onClick={() => setFields([...fields, { name: "", value: "" }])}
        >
          + Add Field
        </button>

        <button
          className="bg-blue-600 text-white w-full p-2 rounded"
          onClick={handleAddResource}
        >
          {existingResource ? "Update Resource" : "Add Resource"}
        </button>

        <button className="mt-2 w-full text-red-500" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
