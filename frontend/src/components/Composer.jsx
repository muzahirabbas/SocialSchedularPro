
import React, { useState, useCallback } from 'react';
import PlatformSelector from './PlatformSelector';
import Preview from './Preview';

const platformConfig = {
  twitter: { name: 'X (Twitter)', charLimit: 280, needsBusiness: false, requiresPaid: true },
  linkedin: { name: 'LinkedIn', charLimit: 3000, needsBusiness: false, requiresPaid: false },
  instagram: { name: 'Instagram', charLimit: 2200, needsBusiness: true, requiresPaid: false },
  facebook: { name: 'Facebook', charLimit: 63206, needsBusiness: true, requiresPaid: false },
  tiktok: { name: 'TikTok', charLimit: 2200, needsBusiness: true, requiresPaid: false },
};

function Composer({ userId }) {
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postResult, setPostResult] = useState(null);

  const handlePlatformToggle = useCallback((platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  }, []);

  const handlePost = async () => {
    if (selectedPlatforms.length === 0 || !caption) {
      alert('Please write a caption and select at least one platform.');
      return;
    }

    setIsPosting(true);
    setPostResult(null);

    // In a real app, you would upload the mediaFile to a storage service (like R2)
    // and get a URL to send to the worker. For this example, we'll pretend.
    const mediaUrl = mediaFile ? 'https://path.to.your.uploaded/media.jpg' : null;

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          caption,
          platforms: selectedPlatforms,
          mediaUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to post.');
      }
      setPostResult(result);

    } catch (error) {
      setPostResult({ error: error.message });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="composer-container">
      <div className="composer">
        <textarea
          className="composer-textarea"
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <PlatformSelector
          platformConfig={platformConfig}
          selectedPlatforms={selectedPlatforms}
          onToggle={handlePlatformToggle}
          captionLength={caption.length}
        />
        <div className="composer-actions">
           <div className="media-upload">
            <label htmlFor="media-input" className="media-upload-label">
                {mediaFile ? `Selected: ${mediaFile.name}` : 'Upload Media'}
            </label>
            <input 
                id="media-input" 
                type="file" 
                onChange={(e) => setMediaFile(e.target.files[0])} 
            />
          </div>
          <button
            className="post-button"
            onClick={handlePost}
            disabled={isPosting || selectedPlatforms.length === 0}
          >
            {isPosting ? 'Posting...' : 'Post Now'}
          </button>
        </div>
      </div>
      
      {selectedPlatforms.length > 0 && (
        <Preview 
            platforms={selectedPlatforms} 
            caption={caption}
            platformConfig={platformConfig}
        />
      )}

      {postResult && (
        <pre className="post-result">{JSON.stringify(postResult, null, 2)}</pre>
      )}
    </div>
  );
}

export default Composer;
