import { useState } from "react";
import Popover from "#/components/popover/Popover";
import { usePopoverContext } from "#/components/popover/hook";
import Button from "#/components/button/Button";
import { encodeShareURL } from "#/shared/shareState";
import css from "./shareButton.module.css";

const ShareTrigger = ({ onUrl }: { onUrl: (url: string) => void }) => {
  const { toggle } = usePopoverContext();

  const handleClick = async () => {
    const url = await encodeShareURL();
    await navigator.clipboard.writeText(url);
    onUrl(url);
    toggle();
  };

  return (
    <Popover.Trigger onClick={handleClick}>
      <Button size="sm">Share</Button>
    </Popover.Trigger>
  );
};

const ShareButton = () => {
  const [url, setUrl] = useState("");

  return (
    <Popover>
      <ShareTrigger onUrl={setUrl} />
      <Popover.Content>
        {({ close }) => (
          <div className={css.popup}>
            <p>Link copied!</p>
            <div className={css.url}>{url}</div>
            <p>Paste it anywhere to share your build.</p>
            <Button size="sm" onClick={close}>
              Got it
            </Button>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};

export default ShareButton;
