import React, { useState } from 'react';
import './TagView.css';

const TagView = ({ tagData }) => {
  const [tree, setTree] = useState(tagData);
  const [exportedData, setExportedData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCollapse = (tag) => {
    const updatedTree = updateCollapseState(tree, tag.name);
    setTree(updatedTree);
  };

  const updateCollapseState = (node, tagName) => {
    if (node.name === tagName) {
      return { ...node, collapsed: !node.collapsed };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) => updateCollapseState(child, tagName)),
      };
    }

    return node;
  };

  const handleTagNameEdit = (tag) => {
    const updatedTree = updateTagName(tree, tag.name, true);
    setTree(updatedTree);
  };

  const handleTagNameChange = (e, tag) => {
    const updatedTree = updateTagName(tree, tag.name, false, e.target.value);
    setTree(updatedTree);
  };

  const handleTagNameBlur = (tag) => {
    const updatedTree = updateTagName(tree, tag.name, true);
    setTree(updatedTree);
  };

  const renderTags = (tags) => {
    return tags.map((tag, index) => (
      <div key={index} className={`tag ${tag.collapsed ? 'collapsed' : ''}`}>
        <div className="tag-header">
          <button onClick={() => toggleCollapse(tag)}>{tag.collapsed ? '>' : '▼'}</button>
          {tag.editing ? (
            <input
              type="text"
              value={tag.name || ''}
              onChange={(e) => handleTagNameChange(e, tag)}
              onBlur={() => handleTagNameBlur(tag)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTagNameBlur(tag);
                }
              }}
            />
          ) : (
            <span onClick={() => handleTagNameEdit(tag)}>{tag.name}</span>
          )}
        </div>
        {!tag.collapsed && (
          <>
            {tag.data !== undefined ? (
              <input
                type="text"
                value={tag.data || ''}
                onChange={(e) => handleTagDataChange(e, tag)}
              />
            ) : (
              <button onClick={() => addChildTag(tag)}>Add Child</button>
            )}
            {tag.children && renderTags(tag.children)}
          </>
        )}
      </div>
    ));
  };

  const handleTagDataChange = (e, tag) => {
    const updatedTree = updateTagData(tree, tag.name, e.target.value);
    setTree(updatedTree);
  };

  const addChildTag = (parentTag) => {
    const updatedTree = addChild(tree, parentTag.name);
    setTree(updatedTree);
  };

  const updateTagData = (node, tagName, newData) => {
    if (node.name === tagName) {
      return { ...node, data: newData };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) => updateTagData(child, tagName, newData)),
      };
    }

    return node;
  };

  const addChild = (node, parentName) => {
    if (node.name === parentName) {
      const newChild = { name: 'New Child', data: 'Data' };
      return {
        ...node,
        data: undefined,
        children: [...(node.children || []), newChild],
      };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) => addChild(child, parentName)),
      };
    }

    return node;
  };

  const updateTagName = (node, tagName, isEditing, newName = '') => {
    if (node.name === tagName) {
      return { ...node, editing: isEditing, name: newName };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) => updateTagName(child, tagName, isEditing, newName)),
      };
    }

    return node;
  };

  const trimTree = (node) => {
    const { name, children, data } = node;
    const trimmedNode = { name };

    if (children && children.length > 0) {
      trimmedNode.children = children.map(trimTree);
    }

    if (data) {
      trimmedNode.data = data;
    }

    return trimmedNode;
  };

  const exportTree = () => {
    const trimmedData = JSON.stringify(trimTree(tree), null, 2);
    setExportedData(trimmedData);
    setIsModalOpen(true);
  };

  const closeExportModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="tag-view">
      <button onClick={exportTree}>Export</button>
      {renderTags([tree])}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <pre>{exportedData}</pre>
            <button onClick={closeExportModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagView;
