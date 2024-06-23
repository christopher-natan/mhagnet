import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/error/error_routes.dart';
import 'package:kitakits/plugins/permission/pages/permission_page_controller.dart';
import 'package:kitakits/plugins/permission/permission.dart';
import 'package:kitakits/plugins/permission/permission_routes.dart';

class PermissionPageEvent extends Permission {
  late PermissionPageController _controller;
  final RxString onRendered = ''.obs;
  int steps = 0;
  String name = '::PermissionPageEvent';

  Future<void> setInit(PermissionPageController controller) async {
    _controller = controller;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();

    await _withLocationService();
  }

  Future<void> onPressedGrantPermission() async {
    bool isGranted = await locationService.askPermission();
    if (isGranted) {
      steps = 1;
      await _controller.rebuild();
      Future.delayed(const Duration(seconds: 1), () async {
        steps = 2;
        await _controller.rebuild();
      });
      return;
    }
    await set(dialogService.onPermissionsNeedsGranted);
  }

  Future<void> onPressedAllowNotification() async {
    Future<void> proceed() async {
      await set(spinnerWidgetService.onShow);
      await _controller.rebuild();
      await networkService.checkConnectivity();
      Future.delayed(const Duration(seconds: 6), () async => await set(spinnerWidgetService.onHide));
      Get.back();
    }

    AwesomeNotifications().isNotificationAllowed().then((isAllowed) async {
      if (isAllowed) {
        await proceed();
        return;
      }
      if (!isAllowed) {
        AwesomeNotifications().requestPermissionToSendNotifications().then((isAllowed) async {
          return await proceed();
        });
      }
    });
  }

  Future<void> _withLocationService() async {
    await on(locationService.onDenied, () async {
      pr(name, 'locationService.onDenied');
      Get.offAndToNamed(PermissionRoutes.permissionPage);
    });
    await on(locationService.onDeniedForever, () async {
      pr(name, 'locationService.onDeniedForever');
      Get.offAndToNamed(PermissionRoutes.permissionPage);
    });
    await on(locationService.onDisabled, () async {
      pr(name, 'locationService.onDisabled');
      Get.offAndToNamed(ErrorRoutes.errorPage, arguments: errorService.locationDisabled);
    });
  }
}
