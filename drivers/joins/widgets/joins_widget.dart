import 'package:flutter/material.dart';
import 'package:flutter_animator/flutter_animator.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/joins/widgets/joins_widget_controller.dart';
import 'package:kitakits/plugins/widgets/custom/button_widget.dart';
import 'package:kitakits/plugins/widgets/custom/text_widget.dart';
import 'package:kitakits/strings.dart';
import 'package:kitakits/styles.dart';
import 'package:kitakits/utils/app_util.dart';
import 'package:line_icons/line_icons.dart';

class JoinsWidget extends GetResponsiveView<JoinsWidgetController> {
  JoinsWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<JoinsWidgetController>(
        id: controller.idJoins,
        builder: (instance) {
          if (!instance.usersModel.isHookup()) return Container();
          AnimationPreferences preferences = const AnimationPreferences(offset: Duration(milliseconds: 500));
          if (instance.status == JoinsStatus.close) return ZoomOut(preferences: preferences, child: _buildContent(instance));
          if (instance.status == JoinsStatus.open) return ZoomIn(preferences: preferences, child: _buildContent(instance));
          return Container();
        });
  }

  Widget _buildContent(JoinsWidgetController instance) {
    Widget button = Container(
        padding: const EdgeInsets.all(25),
        child: ButtonWidget.elevatedPositive('Cancel', color: Styles.accentColor(), onPressed: () => controller.onPressedCancelHookUp()));
    Widget egg = SizedBox(width: Get.width / 1.3, child: AppUtil.getLottie("hookup/egg"));

    Widget content = Container(
        color: Colors.white,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          mainAxisSize: MainAxisSize.max,
          children: [
            const SizedBox(height: 15),
            egg,
            _buildJoinId(instance),
            button,
          ],
        ));

    return content;
  }

  Widget _buildSocialButton({required IconData icon, required Function onPressed}) {
    return SizedBox(
        height: 45,
        child: ElevatedButton(
          onPressed: () => onPressed(), // icon of the button
          style: ElevatedButton.styleFrom(
            // styling the button
            shape: const CircleBorder(),
            padding: const EdgeInsets.all(10),
            backgroundColor: Styles.primaryColor(), // Button color
            foregroundColor: Styles.secondaryColor(), // Splash color
          ),
          child: Icon(icon, color: Colors.white),
        ));
  }

  Widget _buildShare(JoinsWidgetController instance) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildSocialButton(icon: LineIcons.sms, onPressed: () => instance.onPressedShareSms()),
        _buildSocialButton(icon: LineIcons.twitter, onPressed: () => instance.onPressedShareTwitter()),
        _buildSocialButton(icon: LineIcons.whatSApp, onPressed: () => instance.onPressedShareWhatsapp()),
        _buildSocialButton(icon: LineIcons.telegram, onPressed: () => instance.onPressedShareTelegram()),
      ],
    );
  }

  Widget _buildJoinId(JoinsWidgetController instance) {
    return Container(
      padding: const EdgeInsets.all(30),
      child: Column(
        children: [
          Column(mainAxisAlignment: MainAxisAlignment.center, mainAxisSize: MainAxisSize.min, children: [
            TextWidget.s35w400(instance.joinsModel.getPlainJoinId(), color: Styles.secondaryColor()),
            OutlinedButton(
              onPressed: () => instance.onPressedShare(),
              style: OutlinedButton.styleFrom(
                  shape: const StadiumBorder(), backgroundColor: Colors.black12, foregroundColor: Styles.darkColor(), minimumSize: const Size(30, 30)),
              child: const Text('Share'),
            )
          ]),
          const SizedBox(height: 10),
          Padding(padding: const EdgeInsets.all(10), child: TextWidget.s16w400(Strings.msg("e110"), textAlign: TextAlign.center)),
           const SizedBox(height: 30),
          //_buildShare(instance)
        ],
      ),
    );
  }
}
