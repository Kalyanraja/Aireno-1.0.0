// src/navigation/linking.js
export const linking = {
    prefixes: ['aireno://', 'https://aireno.com'],
    
    config: {
      screens: {
        Auth: {
          screens: {
            Login: 'login',
            Register: 'register',
            ForgotPassword: 'forgot-password',
          }
        },
        Main: {
          screens: {
            Home: 'home',
            Projects: {
              path: 'projects',
              screens: {
                ProjectsList: 'list',
                ProjectDetails: {
                  path: ':id',
                  parse: {
                    id: (id) => `${id}`,
                  }
                }
              }
            },
            Processing: {
              path: 'processing',
              screens: {
                ImageUpload: 'upload',
                Options: 'options',
                Results: 'results/:id',
              }
            },
            Profile: {
              path: 'profile',
              screens: {
                UserProfile: 'view',
                EditProfile: 'edit',
                Settings: 'settings',
              }
            }
          }
        }
      }
    }
  };
  
  // Handle deep link in App.js or navigation setup
  import { linking } from './src/navigation/linking';
  
  const App = () => {
    return (
      <NavigationContainer linking={linking} fallback={<LoadingScreen />}>
        {/* Your navigation setup */}
      </NavigationContainer>
    );
  };