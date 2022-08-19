import React from 'react';

interface Props {
  onClick: () => any;
}

export const CreateBoxBtn: React.FC<Props> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="text-9xl font-black pt-20 pl-10 cursor-pointer text-slate-300 hover:text-slate-500 transition-all">
      +
    </div>
  );
};
