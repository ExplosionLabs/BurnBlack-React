import React, { ReactNode } from 'react';
import TopUserDetail from './TopUserDetail';
import SectionNavigation from './SectionNavigation';

interface UserDetailLayoutProps {
  backLink: string;
  nextLink: string;
  children: ReactNode;
}

const UserDetailLayout: React.FC<UserDetailLayoutProps> = ({ backLink, nextLink, children }) => {
  return (
    <div className="lg:col-span-2">
      <div className="mx-auto p-3 lg:p-5">
        <TopUserDetail backLink={backLink} nextLink={nextLink} />
        <div className="bg-white px-4 py-4 rounded-md shadow-sm mb-4">
          <SectionNavigation />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailLayout;
