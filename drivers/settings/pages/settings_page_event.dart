import 'package:get/get.dart';
import 'package:kitakits/plugins/credits/credits_routes.dart';
import 'package:kitakits/plugins/google/signin/signin_routes.dart';
import 'package:kitakits/plugins/settings/pages/settings_page_controller.dart';
import 'package:kitakits/plugins/settings/settings.dart' as plugin;
import 'package:kitakits/routes.dart';

class SettingsPageEvent extends plugin.Settings {
  late SettingsPageController _controller;
  String name = '::SettingsPageEvent';

  Future<void> setInit(SettingsPageController controller) async {
    _controller = controller;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
  }

  Future<void> onPressedAvatar() async {
    Get.toNamed(Routes.profileAvatarPage);
  }

  Future<void> onPressedDetails() async {
    Get.toNamed(Routes.profileDetailsPage);
  }

  Future<void> onPressedAccount() async {
    Get.toNamed(SignInRoutes.signInPage);
  }

  Future<void> onPressedCredits() async {
    Get.toNamed(CreditsRoutes.creditsPage);
  }

  Future<void> onPressedExit() async {
    await set(dialogService.onBeforeExitApp);
  }

  Future<void> onPressedPrivacy() async {
    Get.toNamed(Routes.privacyPage);
  }

  Future<void> onPressedAbout() async {
    Get.toNamed(Routes.aboutPage);
  }

  Future<void> onPressedSwitch(String field, value) async {
    await settingsModel.save(field, value);
    await _controller.rebuild();
  }
}
