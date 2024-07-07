import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFolder,
  faAngleRight,
  faAngleDown,
  faTrashAlt,
  faTimes,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import useFileManagerLogic from "./FileManagerLogic";

const FileManagerRender = () => {
  const {
    folders,
    newFileName,
    setNewFileName,
    newFolderName,
    setNewFolderName,
    showFileInput,
    setShowFileInput,
    showFolderInput,
    setShowFolderInput,
    expandedFolders,

    selectedFolderPath,

    selectedItemName,

    showDeletePopup,

    editItemPath,

    editedItemName,

    fileInputRef,
    folderInputRef,
    fileContainerRef,
    folderContainerRef,
    handleFolderClick,

    handleCreateFileOrFolder,
    handleDelete,
    confirmDelete,
    cancelDelete,
    startEditName,
    handleEditNameChange,
    saveEditedName,
  } = useFileManagerLogic();

  const renderFolders = (folders, path = []) => {
    return folders.map((folder, index) => {
      const currentPath = [...path, index];
      const pathString = currentPath.join("-");
      const isExpanded = expandedFolders.includes(pathString);
      const isSelected = selectedFolderPath === pathString;
      const isEditing = editItemPath === pathString;
      const isFolder = folder.type === "folder";

      return (
        <div
          key={pathString}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: isSelected ? "#80808038" : "transparent",
          }}
        >
          <div
            style={{
              marginLeft: `${path.length * 20}px`,
              flex: "1",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px",
              }}
              onClick={() => handleFolderClick(pathString, folder.name)}
            >
              {isFolder && (
                <>
                  <FontAwesomeIcon
                    icon={isExpanded ? faAngleDown : faAngleRight}
                    style={{ marginRight: "5px" }}
                  />
                  <FontAwesomeIcon
                    icon={faFolder}
                    color="blue"
                    size="1x"
                    style={{ marginRight: "5px" }}
                  />
                </>
              )}
              {folder.type === "file" && (
                <FontAwesomeIcon
                  icon={faFile}
                  color="green"
                  size="1x"
                  style={{ marginRight: "5px" }}
                />
              )}
              {isEditing ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    value={editedItemName}
                    onChange={handleEditNameChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEditedName();
                      }
                    }}
                    onBlur={saveEditedName}
                    autoFocus
                  />
                  <button
                    style={{
                      marginLeft: "5px",
                      backgroundColor: "blue",
                      color: "white",
                      border: "1px solid white",
                      borderRadius: "2px",
                    }}
                    onClick={saveEditedName}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>{folder.name}</div>
              )}
            </div>

            {isSelected && isFolder && (
              <div
                className="modal-backdrop"
                style={{
                  display: showFolderInput || showFileInput ? "flex" : "none",
                  marginLeft: "8px",
                }}
              >
                {showFolderInput && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                    ref={folderContainerRef}
                  >
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        flex: "1",
                        marginRight: "10px",
                      }}
                      ref={folderInputRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateFileOrFolder("folder", pathString);
                        }
                      }}
                    />
                    <button
                      onClick={() =>
                        handleCreateFileOrFolder("folder", pathString)
                      }
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Create Folder
                    </button>
                    <button
                      onClick={() => setShowFolderInput(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
                {showFileInput && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                    ref={fileContainerRef}
                  >
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="Enter File name"
                      style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        flex: "1",
                        marginRight: "10px",
                      }}
                      ref={fileInputRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateFileOrFolder("file", pathString);
                        }
                      }}
                    />
                    <button
                      onClick={() =>
                        handleCreateFileOrFolder("file", pathString)
                      }
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Create File
                    </button>
                    <button
                      onClick={() => setShowFileInput(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
              </div>
            )}
            {isExpanded &&
              folder.children &&
              renderFolders(folder.children, currentPath)}
          </div>
        </div>
      );
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "black",
          padding: "5px",
          color: "white",
        }}
      >
        <h2 style={{ marginRight: "10px" }}>File Manager</h2>
        <span style={{ display: "flex", alignItems: "center" }}>
          <p style={{ marginLeft: "10px", cursor: "pointer" }}>
            <FontAwesomeIcon
              icon={faFile}
              color="green"
              size="1x"
              onClick={() => {
                setShowFileInput(true);
                setShowFolderInput(false);
              }}
            />
          </p>
          <p style={{ marginLeft: "20px", cursor: "pointer" }}>
            <FontAwesomeIcon
              icon={faFolder}
              color="blue"
              size="1x"
              onClick={() => {
                setShowFolderInput(true);
                setShowFileInput(false);
              }}
            />
          </p>
          <p style={{ marginLeft: "20px", cursor: "pointer" }}>
            <FontAwesomeIcon
              icon={faTrashAlt}
              color="red"
              size="1x"
              onClick={(e) => handleDelete(selectedFolderPath, e)}
            />
          </p>
          <p style={{ marginLeft: "20px", cursor: "pointer" }}>
            <FontAwesomeIcon
              icon={faPen}
              color="yellow"
              size="1x"
              onClick={(e) => startEditName(selectedFolderPath)}
            />
          </p>
        </span>
      </div>

      <div style={{ flex: "1", display: "flex", overflowY: "auto" }}>
        <div
          style={{
            flex: "1",
            backgroundColor: "rgb(12 9 9 / 98%)",
            padding: "8px",
            color: "white",
          }}
        >
          {renderFolders(folders)}
        </div>

        <div
          style={{
            flex: "1",
            padding: "8px",
            borderLeft: "1px solid #ccc",
            backgroundColor: "#c2c2c2",
            color: "black",
          }}
        >
          <h1>Hi, I am {selectedItemName}..</h1>
        </div>
      </div>

      {showDeletePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            <p>Are you sure you want to delete this item?</p>
            <button
              style={{
                margin: "0 10px",
                padding: "8px 16px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={confirmDelete}
            >
              Delete
            </button>
            <button
              style={{
                margin: "0 10px",
                padding: "8px 16px",
                backgroundColor: "#e0e0e0",
                border: "none",
                cursor: "pointer",
              }}
              onClick={cancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManagerRender;
