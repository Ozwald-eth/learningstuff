"use client";
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Learning Scrapbook</h1>

      <div className="flex space-x-4 mb-6">
        <button
          className="bg-blue-600 text-white p-4 rounded-full"
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
                      className="bg-white p-4 rounded-lg shadow mb-4"
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
