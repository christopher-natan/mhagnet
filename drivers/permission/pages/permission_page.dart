import 'package:flutter/material.dart';
import 'package:flutter_animator/flutter_animator.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/permission/pages/permission_page_controller.dart';
import 'package:kitakits/plugins/spinner/widgets/spinner_widget.dart';
import 'package:kitakits/plugins/widgets/custom/button_widget.dart';
import 'package:kitakits/plugins/widgets/custom/text_widget.dart';
import 'package:kitakits/strings.dart';
import 'package:kitakits/utils/app_util.dart';

class PermissionPage extends GetResponsiveView<PermissionPageController> {
  PermissionPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetBuilder<PermissionPageController>(
        id: controller.idPermission,
        builder: (instance) {
          return Stack(children: [Container(color: Colors.white, child: _buildButton(instance)), SpinnerWidget()]);
        });
  }

  Widget _buildButton(PermissionPageController instance) {
    final currentWidth = Get.width;
    final currentHeight = Get.height;
    Widget child = Container();
    AnimationPreferences animationPreferences = const AnimationPreferences(offset: Duration(milliseconds: 500));

    Widget locationPermission = Padding(
      padding: const EdgeInsets.all(30),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            height: Get.height / 2,
            child: AppUtil.getLottie('permission/request_location'),
          ),
          Column(children: [
            TextWidget.s24w400(Strings.title("a93")),
            const SizedBox(
              height: 30,
            ),
            Container(
              margin: const EdgeInsets.all(5),
              child: TextWidget.s16w400(Strings.msg("a93")),
            ),
            const SizedBox(
              height: 20,
            )
          ]),
          Container(child: ButtonWidget.elevatedPositive("Allow", onPressed: controller.onPressedGrantPermission)),
        ],
      ),
    );

    Widget notificationPermission = Padding(
      padding: const EdgeInsets.all(30),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            height: Get.height / 2,
            child: AppUtil.getLottie('notifications'),
          ),
          Column(children: [
            TextWidget.s24w400('Notification Permission'),
            const SizedBox(
              height: 30,
            ),
            Container(
              margin: const EdgeInsets.all(5),
              child: TextWidget.s16w400(Strings.msg("a96")),
            ),
            const SizedBox(
              height: 20,
            )
          ]),
          Container(child: ButtonWidget.elevatedPositive("Allow", onPressed: controller.onPressedAllowNotification)),
        ],
      ),
    );

    if (instance.steps == 0) child = FadeIn(preferences: animationPreferences, child: locationPermission);
    if (instance.steps == 1) child = FadeOut(preferences: animationPreferences, child: locationPermission);
    if (instance.steps == 2) child = FadeIn(preferences: animationPreferences, child: notificationPermission);

    return Container(
        width: currentWidth,
        height: currentHeight,
        color: Colors.white,
        child: child);
  }
}
