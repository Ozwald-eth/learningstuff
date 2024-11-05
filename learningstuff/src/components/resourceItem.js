import { useState } from "react";

export default function ResourceItem({ resource, onDelete, onEdit, onExpand }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpand(newExpandedState); // Notify parent component of expanded state
  };

  const formatContent = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative p-2">
      <h3 className="font-semibold text-lg">{resource.title || "Untitled"}</h3>
      <p
        className={`${isExpanded ? "" : "truncate"}`}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {formatContent(resource.content)}
      </p>

      {isExpanded && (
        <div className="paper-lines mt-2" style={{ whiteSpace: "pre-wrap" }}>
          {Object.keys(resource).map(
            (key) =>
              key !== "id" &&
              key !== "content" &&
              key !== "type" && (
                <p key={key}>
                  <span className="field-name">{key}:</span>{" "}
                  {formatContent(resource[key])}
                </p>
              )
          )}
        </div>
      )}

      <button className="text-blue-500 mt-2" onClick={handleToggleExpand}>
        {isExpanded ? "Show Less" : "Read More"}
      </button>

      <div className="flex space-x-4 mt-2">
        <button className="text-green-500" onClick={onEdit}>
          Edit
        </button>
        <button className="text-red-500" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
