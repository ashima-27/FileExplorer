import { useState, useEffect, useRef } from 'react';
import initialFolders from './constants';

const useFileManagerLogic = () => {
    const [folders, setFolders] = useState(() => {
        try {
            const savedFolders = localStorage.getItem('folders');
            return savedFolders ? JSON.parse(savedFolders) : initialFolders;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return initialFolders;
        }
    });

    const [newFileName, setNewFileName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [showFileInput, setShowFileInput] = useState(false);
    const [showFolderInput, setShowFolderInput] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState([]);
    
    const [selectedFolderPath, setSelectedFolderPath] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState('');

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deletePath, setDeletePath] = useState(null);

    const [editItemPath, setEditItemPath] = useState(null);
    const [editedItemName, setEditedItemName] = useState('');

    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const fileContainerRef = useRef(null);
    const folderContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                fileContainerRef.current && !fileContainerRef.current.contains(event.target) &&
                folderContainerRef.current && !folderContainerRef.current.contains(event.target)
            ) {
                setShowFileInput(false);
                setShowFolderInput(false);
                if (editItemPath !== null) {
                    saveEditedName();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFileInput, showFolderInput, editItemPath]);

    useEffect(() => {
        localStorage.setItem('folders', JSON.stringify(folders));
    }, [folders]);

    useEffect(() => {
        if (showFileInput && fileInputRef.current) {
            fileInputRef.current.focus();
        }
    }, [showFileInput]);

    useEffect(() => {
        if (showFolderInput && folderInputRef.current) {
            folderInputRef.current.focus();
        }
    }, [showFolderInput]);

    const handleFolderClick = (indexPath, folderName) => {
        if (selectedFolderPath !== null) {
            setSelectedFolderPath(null);
            setSelectedItemName('');
        }

        if (expandedFolders.includes(indexPath)) {
            setExpandedFolders(expandedFolders.filter(path => path !== indexPath));
        } else {
            setExpandedFolders([...expandedFolders, indexPath]);
        }

        setSelectedFolderPath(indexPath);
        setSelectedItemName(folderName);
    };

    const findFolderByPath = (folders, path) => {
        return path.reduce((currentFolder, index) => {
            return currentFolder.children[index];
        }, { children: folders });
    };

    const handleCreateFileOrFolder = (type, path) => {
        const newFolderStructure = [...folders];

        if (path === null || path === undefined) {
            if (type === 'folder') {
                newFolderStructure.push({ name: newFolderName, children: [], type: 'folder' });
                setNewFolderName('');
            }
        } else {
            const selectedFolder = findFolderByPath(newFolderStructure, path.split('-').map(Number));

            if (type === 'file') {
                selectedFolder.children.push({ name: newFileName, type: 'file' });
                setNewFileName('');
            } else if (type === 'folder') {
                selectedFolder.children.push({ name: newFolderName, children: [], type: 'folder' });
                setNewFolderName('');
            }
        }

        setFolders(newFolderStructure);
        setShowFileInput(false);
        setShowFolderInput(false);
    };

    const handleDelete = (pathString, e) => {
        e.stopPropagation();
        const folderToDelete = findFolderByPath(folders, pathString.split('-').map(Number));

        if (folderToDelete?.cancel === 'false') {
            alert("Cannot delete root folders!");
            console.log('Cannot delete root folders.');
            return;
        }

        setDeletePath(pathString);
        setShowDeletePopup(true);
    };

    const confirmDelete = () => {
        const path = deletePath.split('-').map(Number);
        const newFolderStructure = [...folders];

        if (path?.length === 1) {
            newFolderStructure.splice(path[0], 1);
        } else {
            const parentFolderPath = path.slice(0, -1);
            const parentFolder = findFolderByPath(newFolderStructure, parentFolderPath);
            parentFolder.children.splice(path[path?.length - 1], 1);
        }

        setFolders(newFolderStructure);
        setShowDeletePopup(false);
    };

    const cancelDelete = () => {
        setShowDeletePopup(false);
    };

    const startEditName = (pathString) => {
        setEditItemPath(pathString);
        const itemToEdit = findFolderByPath(folders, pathString.split('-').map(Number));
        setEditedItemName(itemToEdit.name);
    };

    const handleEditNameChange = (e) => {
        setEditedItemName(e.target.value);
    };

    const saveEditedName = () => {
        if (editItemPath !== null) {
            const path = editItemPath.split('-').map(Number);
            const newFolderStructure = [...folders];
            const itemToEdit = findFolderByPath(newFolderStructure, path);
            itemToEdit.name = editedItemName;
            setFolders(newFolderStructure);
            setEditItemPath(null);
        }
        if (selectedFolderPath === editItemPath) {
            setSelectedItemName(editedItemName);
        }
    };

    return {
        folders,
        setFolders,
        newFileName,
        setNewFileName,
        newFolderName,
        setNewFolderName,
        showFileInput,
        setShowFileInput,
        showFolderInput,
        setShowFolderInput,
        expandedFolders,
        setExpandedFolders,
        selectedFolderPath,
        setSelectedFolderPath,
        selectedItemName,
        setSelectedItemName,
        showDeletePopup,
        setShowDeletePopup,
        deletePath,
        setDeletePath,
        editItemPath,
        setEditItemPath,
        editedItemName,
        setEditedItemName,
        fileInputRef,
        folderInputRef,
        fileContainerRef,
        folderContainerRef,
        handleFolderClick,
        findFolderByPath,
        handleCreateFileOrFolder,
        handleDelete,
        confirmDelete,
        cancelDelete,
        startEditName,
        handleEditNameChange,
        saveEditedName
    };
};

export default useFileManagerLogic;
