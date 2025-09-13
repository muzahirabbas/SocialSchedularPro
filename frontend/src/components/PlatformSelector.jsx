
import React from 'react';

function PlatformToggle({ platform, config, isSelected, onToggle, captionLength }) {
  const isLimitExceeded = config.charLimit && captionLength > config.charLimit;
  const tooltipText = `${config.name} ${config.needsBusiness ? ' (Needs Business Account)' : ''} ${config.requiresPaid ? '(Requires Paid API)' : ''}`;

  return (
    <div
      className="platform-toggle"
      data-selected={isSelected}
      data-limit-exceeded={isLimitExceeded}
      onClick={() => onToggle(platform)}
    >
      <span>{config.name}</span>
      {config.charLimit && (
        <span className="char-counter">
          {captionLength}/{config.charLimit}
        </span>
      )}
      <span className="tooltip">{tooltipText}</span>
    </div>
  );
}

function PlatformSelector({ platformConfig, selectedPlatforms, onToggle, captionLength }) {
  return (
    <div className="platform-selector">
      {Object.entries(platformConfig).map(([platform, config]) => (
        <PlatformToggle
          key={platform}
          platform={platform}
          config={config}
          isSelected={selectedPlatforms.includes(platform)}
          onToggle={onToggle}
          captionLength={captionLength}
        />
      ))}
    </div>
  );
}

export default PlatformSelector;
