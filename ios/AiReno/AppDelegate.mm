#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                               moduleName:@"AiReno"
                                        initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
      self.window.rootViewController = [UIViewController new];
      self.window.rootViewController.view = rootView;
      [self.window makeKeyAndVisible];
  } else {
      // Fallback on earlier versions
      self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
      self.window.rootViewController = [UIViewController new];
      self.window.rootViewController.view = rootView;
      [self.window makeKeyAndVisible];
  }
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
