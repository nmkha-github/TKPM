import React from 'react';
import ReactDOM from 'react-dom/client';
import AppSnackbarProvider from './lib/provider/AppSnackBarProvider';
import {  BrowserRouter } from "react-router-dom";
import AuthProvider from './lib/provider/AuthProvider';
import RoomsProvider from './lib/provider/RoomsProvider';
import Header from './modules/layout/components/Header/Header'
import UserProvider from './lib/provider/UserProvider';
import AppRoutes from './AppRoutes';
import MembersProvider from './lib/provider/MembersProvider';
import TasksProvider from './lib/provider/TasksProvider';
import PostsProvider from './lib/provider/PostsProvider';
import ConfirmDialogProvider from './lib/provider/ConfirmDialogProvider';
import ScheduleProvider from './lib/provider/ScheduleProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppSnackbarProvider>
      <BrowserRouter>
        <ConfirmDialogProvider>
          <AuthProvider>
            <UserProvider>
              <Header>
                {/* add provider here */}
                <ScheduleProvider>
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
                </ScheduleProvider>
                {/* ----------------- */}
              </Header>
            </UserProvider>
          </AuthProvider>
        </ConfirmDialogProvider>
      </BrowserRouter>
    </AppSnackbarProvider>
);