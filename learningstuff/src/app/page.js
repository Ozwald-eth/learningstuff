"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, remove, update } from "firebase/database";
import ResourceItem from "../components/resourceItem";
import AddResourceModal from "../components/addResourceModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function HomePage() {
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null); // Track expanded card

  useEffect(() => {
    const resourcesRef = ref(db, "resources");
    onValue(resourcesRef, (snapshot) => {
      const data = snapshot.val();
      const resourcesArray = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setResources(resourcesArray);
    });
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedResources = Array.from(resources);
    const [movedItem] = reorderedResources.splice(result.source.index, 1);
    reorderedResources.splice(result.destination.index, 0, movedItem);

    setResources(reorderedResources);
  };

  const handleDelete = (resourceId) => {
    const resourceRef = ref(db, `resources/${resourceId}`);
    remove(resourceRef);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingResource(null);
  };

  const handleExpand = (id, isExpanded) => {
    setExpandedCardId(isExpanded ? id : null); // Track the expanded card's ID
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        Learning Scrapbook
      </h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          style={{
            backgroundColor: "#2563eb", // Blue-600
            color: "white",
            padding: "1rem",
            borderRadius: "9999px", // Rounded full
          }}
          onClick={() => setShowModal(true)}
        >
          Add Resource
        </button>
      </div>

      {/* Draggable Regular Notes Section */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="resources">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {resources.map((resource, index) => (
                <Draggable
                  key={resource.id}
                  draggableId={resource.id}
                  index={index}
                  isDragDisabled={expandedCardId === resource.id} // Disable dragging if this card is expanded
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        backgroundColor: "white",
                        padding: "1rem",
                        borderRadius: "0.5rem", // Rounded-lg
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Shadow
                        marginBottom: "1rem",
                      }}
                    >
                      <ResourceItem
                        resource={resource}
                        onDelete={() => handleDelete(resource.id)}
                        onEdit={() => handleEdit(resource)}
                        onExpand={(isExpanded) =>
                          handleExpand(resource.id, isExpanded)
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showModal && (
        <AddResourceModal
          onClose={handleModalClose}
          existingResource={editingResource}
        />
      )}
    </div>
  );
}
