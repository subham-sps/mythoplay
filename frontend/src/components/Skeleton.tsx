import React from 'react';

type SkeletonProps = {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
};

export function Skeleton({ className = '', rounded = 'md' }: SkeletonProps) {
  const radius = {
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  }[rounded];
  return <div className={`skeleton ${radius} ${className}`} aria-hidden="true" />;
}

export function QuizCardSkeleton() {
  return (
    <div className="card-fun h-full flex flex-col gap-3" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10" rounded="full" />
        <Skeleton className="w-16 h-5" />
      </div>
      <Skeleton className="h-6 w-3/4 mt-2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-6 w-20" rounded="full" />
        <Skeleton className="h-6 w-16" rounded="full" />
      </div>
      <Skeleton className="h-11 w-full mt-auto" rounded="lg" />
    </div>
  );
}

export function LeaderboardRowSkeleton() {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100"
      aria-hidden="true"
    >
      <Skeleton className="w-12 h-6" />
      <Skeleton className="w-12 h-12" rounded="full" />
      <div className="flex-grow flex flex-col gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="w-16 h-8" />
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64" aria-hidden="true">
      <Skeleton className="w-full aspect-video" rounded="lg" />
      <Skeleton className="h-4 w-5/6 mt-3" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="card-fun text-center" aria-hidden="true">
      <Skeleton className="w-24 h-24 mx-auto" rounded="full" />
      <Skeleton className="h-7 w-40 mx-auto mt-4" />
      <Skeleton className="h-6 w-56 mx-auto mt-3" rounded="full" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}
