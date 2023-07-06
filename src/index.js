import React from 'react';
import ReactDOM from 'react-dom/client';
import AppSnackbarProvider from './lib/provider/AppSnackBarProvider';
import {  HashRouter } from "react-router-dom";
import AuthProvider from './lib/provider/AuthProvider';
import RoomsProvider from './lib/provider/RoomsProvider';
import Header from './modules/layout/components/Header/Header'
import UserProvider from './lib/provider/UserProvider';
import AppRoutes from './AppRoutes';
import MembersProvider from './lib/provider/MembersProvider';
import TasksProvider from './lib/provider/TasksProvider';
import PostsProvider from './lib/provider/PostsProvider';
import ConfirmDialogProvider from './lib/provider/ConfirmDialogProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppSnackbarProvider>
      <HashRouter>
        <ConfirmDialogProvider>
          <AuthProvider>
            <UserProvider>
              <Header>
                {/* add provider here */}
                <RoomsProvider>
                  <MembersProvider>
                    <TasksProvider>
                      <PostsProvider>
                        {/* ----------------- */}
                        <AppRoutes />
                        {/* add provider here */}
                      </PostsProvider>
                    </TasksProvider>
                  </MembersProvider>
                </RoomsProvider>
                {/* ----------------- */}
              </Header>
            </UserProvider>
          </AuthProvider>
        </ConfirmDialogProvider>
      </HashRouter>
    </AppSnackbarProvider>
);