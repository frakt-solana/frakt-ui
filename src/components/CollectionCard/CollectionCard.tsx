import React from 'react';

interface CollectionCardProps {
  collectionId?: string;
  brandId: string;
  collectionName: string;
  onClick?: () => void;
}

const CollectionCard = ({
  brandId,
  collectionName,
  onClick,
}: CollectionCardProps) => {
  return <div onClick={onClick}>{collectionName}</div>;
};

export default CollectionCard;
