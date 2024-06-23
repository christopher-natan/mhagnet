import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/settings/pages/settings_page_controller.dart';
import 'package:kitakits/plugins/widgets/custom/app_bar_widget.dart';
import 'package:kitakits/plugins/widgets/custom/header_subject_widget.dart';
import 'package:kitakits/plugins/widgets/custom/list_tile_widget.dart';
import 'package:kitakits/styles.dart';
import 'package:line_icons/line_icons.dart';

class SettingsPage extends GetResponsiveView<SettingsPageController> {
  SettingsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetBuilder<SettingsPageController>(
        id: controller.idSettings,
        builder: (instance) {
          return Scaffold(
              resizeToAvoidBottomInset: false,
              appBar: AppBarWidget.back(text: 'Settings'),
              backgroundColor: Styles.primaryColor(),
              body: SafeArea(child: Stack(children: [_buildWrapper(instance)])));
        });
  }

  Widget _buildWrapper(SettingsPageController instance) {
    return AnimatedContainer(
        margin: const EdgeInsets.only(top: 0),
        duration: const Duration(milliseconds: 10),
        height: Get.height - 20,
        child: ClipRRect(
            borderRadius: const BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
            child: Align(alignment: Alignment.topCenter, child: _buildContent(instance))));
  }

  Widget _buildTrailing(SettingsPageController instance) => Icon(
        LineIcons.angleRight,
        color: Styles.darkColor(),
        size: 20,
      );

  Widget _buildContent(SettingsPageController instance) {
    return Container(
        color: Colors.white,
        height: Get.height,
        child: Center(
            child: ListView(padding: const EdgeInsets.all(30), children: [
          HeaderSubjectWidget(
            title: "Profile",
            children: [
              ListTileWidget(title: "Details", icon: LineIcons.user, trailing: _buildTrailing(instance), onTap: instance.onPressedDetails),
              ListTileWidget(title: "Avatar", icon: LineIcons.userCircle, trailing: _buildTrailing(instance), onTap: instance.onPressedAvatar),
              ListTileWidget(title: "Account", icon: LineIcons.key, trailing: _buildTrailing(instance), onTap: instance.onPressedAccount),
              ListTileWidget(title: "Credits", icon: LineIcons.coins, trailing: _buildTrailing(instance), onTap: instance.onPressedCredits),
            ],
          ),
          HeaderSubjectWidget(
            title: "Switch On/Off",
            children: [
              ListTileWidget(
                  title: "Dark Mode",
                  icon: LineIcons.penFancy,
                  trailing: CupertinoSwitch(
                      activeColor: Styles.primaryColor(),
                      value: false,
                      onChanged: null)),
              ListTileWidget(
                  title: "Credits Alert",
                  icon: LineIcons.battery34Full,
                  trailing: CupertinoSwitch(
                      activeColor: Styles.primaryColor(),
                      value: false,
                      onChanged: null)),
              ListTileWidget(
                  title: "Sounds",
                  icon: LineIcons.headphones,
                  trailing: CupertinoSwitch(
                      activeColor: Styles.primaryColor(),
                      value: instance.settingsModel.data.isEnableSounds,
                      onChanged: (value) => instance.onPressedSwitch('isEnableSounds', value))),
              ListTileWidget(
                  title: "Notifications",
                  icon: LineIcons.bell,
                  trailing: CupertinoSwitch(
                      activeColor: Styles.primaryColor(),
                      value: instance.settingsModel.data.isEnableNotifications,
                      onChanged: (value) => instance.onPressedSwitch('isEnableNotifications', value))),
              ListTileWidget(
                  title: "Use Normal Map",
                  icon: LineIcons.marker,
                  trailing: CupertinoSwitch(
                      activeColor: Styles.primaryColor(),
                      value: instance.settingsModel.data.isNormalMap,
                      onChanged: (value) => instance.onPressedSwitch('isNormalMap', value))),

            ],
          ),
          HeaderSubjectWidget(
            title: "App",
            children: [
              ListTileWidget(title: "Privacy Policy", icon: LineIcons.paperPlane, trailing: _buildTrailing(instance), onTap: instance.onPressedPrivacy),
              ListTileWidget(title: "About", icon: LineIcons.infoCircle, trailing: _buildTrailing(instance), onTap: instance.onPressedAbout),
              ListTileWidget(title: "Exit", icon: LineIcons.times, trailing: _buildTrailing(instance), onTap: instance.onPressedExit),
            ],
          )
        ])));
  }
}
