import Image from 'next/image';
import React from 'react';

interface SquareBoxProps {
  id: string;
  content: string;
  fnc: () => void;
  imageUrl?: string;
}

const SquareBox = (props: SquareBoxProps) => {
  return (
    <div
      id={props.id}
      className="border rounded-lg p-1 hover:bg-gray-500/50 hover:cursor-pointer flex items-center transition-colors duration-200"
      onClick={props.fnc}
    >
      {props.imageUrl && <Image src={props.imageUrl} alt="아이콘" width={32} height={32} className="mr-2 flex-shrink-0" />}
      <span className="text-sm">{props.content}</span>
    </div>
  );
};

export default SquareBox;
