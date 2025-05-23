import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import './Tag.css';

const dummyTags = [
  { id: 1, tagName: '태그1' },
  { id: 2, tagName: '태그2' },
  { id: 3, tagName: '태그3' },
];

function TagList({ apiUrl = '/qna_tags/list', onSelectTag }) {
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data } = await api.get(apiUrl);
        setTags(data);
      } catch (err) {
        setTags(dummyTags);
        console.error('태그 목록 불러오기 실패, 더미 데이터 사용', err);
      }
    }
    fetchTags();
  }, [apiUrl]);

  const handleTagClick = (tag) => {
    setSelectedTagId(tag.id);
    if (onSelectTag) onSelectTag(tag);
  };

  return (
    <div className="tag-list">
      {tags.map(tag => (
        <button
          key={tag.id}
          className={`tag-button${selectedTagId === tag.id ? ' active-tag' : ''}`}
          onClick={() => handleTagClick(tag)}
        >
          #{tag.tagName}
        </button>
      ))}
    </div>
  );
}

export default TagList;
