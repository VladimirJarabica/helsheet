import Image from "next/image";
import { getHostname } from "../../../utils/sheet";

const SOURCE_IMAGES = [
  { url: "pesnicky.orava.sk", image: "/pesnicky-orava-favicon.ico" },
  { url: "harmonika.cz", image: "/harmonika-cz-favicon.ico" },
];

interface SourceUrlProps {
  url?: string | null;
}

const SourceUrl = ({ url }: SourceUrlProps) => {
  if (!url) {
    return null;
  }

  const hostName = getHostname(url);

  if (!hostName) {
    return null;
  }

  const image = SOURCE_IMAGES.find((source) =>
    hostName.includes(source.url)
  )?.image;

  return (
    <div className="flex">
      Zdroj:&nbsp;
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center"
      >
        {image ? (
          <Image
            src={image}
            alt={hostName}
            className="h-[15px] w-[auto] mt-0.5"
            width={16}
            height={16}
          />
        ) : (
          hostName
        )}
      </a>
    </div>
  );
};

export default SourceUrl;
