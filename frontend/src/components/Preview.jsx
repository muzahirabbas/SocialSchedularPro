
import React from 'react';

function Preview({ platforms, caption, platformConfig }) {
  return (
    <div className="previews-container">
      <h3>Previews</h3>
      {platforms.map(platform => {
        const config = platformConfig[platform];
        const isLimitExceeded = config.charLimit && caption.length > config.charLimit;
        
        return (
          <div key={platform} className="preview-box">
            <div className="preview-header">{config.name}</div>
            {isLimitExceeded && (
              <p style={{ color: '#ff8a80', fontWeight: 'bold' }}>
                Caption is too long. It may be truncated or shortened by Gemini.
              </p>
            )}
            <div className="preview-content">
              {caption}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Preview;