import 'package:flutter/material.dart';
import 'package:flutter_animator/flutter_animator.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/notifications/components/position_retained_scroll_physics.dart';
import 'package:kitakits/plugins/notifications/models/notifications_model.dart';
import 'package:kitakits/plugins/notifications/pages/notifications_page_controller.dart';
import 'package:kitakits/plugins/widgets/custom/app_bar_widget.dart';
import 'package:kitakits/plugins/widgets/custom/text_widget.dart';
import 'package:kitakits/styles.dart';
import 'package:kitakits/utils/app_util.dart';
import 'package:line_icons/line_icons.dart';
import 'package:timeago/timeago.dart' as timeago;

class NotificationsPage extends GetResponsiveView<NotificationsPageController> {
  NotificationsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetBuilder<NotificationsPageController>(
        id: controller.idNotifications,
        builder: (instance) {
          return Scaffold(
              resizeToAvoidBottomInset: false,
              appBar: AppBarWidget.back(text: 'Notifications'),
              backgroundColor: Styles.primaryColor(),
              body: SafeArea(child: _buildContent(instance)));
        });
  }

  Widget _buildContent(NotificationsPageController instance) {
    AnimationPreferences preferences = const AnimationPreferences(offset: Duration(milliseconds: 400));
    List<Notifications> list = instance.notificationsModel.list;

    return Container(
        color: Colors.white,
        padding: const EdgeInsets.only(top: 30),
        child: ListView.builder(
            physics: const PositionRetainedScrollPhysics(),
            itemCount: list.length,
            itemBuilder: (context, index) => instance.notificationsModel.notificationIdToDelete == list[index].notificationId
                ? FadeOut(preferences: preferences, child: _buildRow(data: list[index], instance: instance))
                : _buildRow(data: list[index], instance: instance)));
  }

  Widget _buildRow({required Notifications data, required NotificationsPageController instance}) {
    return Container(
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 1),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _buildAvatar(data: data),
          const SizedBox(width: 16),
          Expanded(
              child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [TextWidget.s16w600(data.title), TextWidget.s14w400(instance.activitiesModel.getMsgRules(data.content))]),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 1),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextWidget.s12w600(timeago.format(AppUtil.getTimestampToDate(data.created)), color: Colors.grey.withOpacity(0.8)),
                    IconButton(onPressed: () => controller.onPressedDelete(data.notificationId), icon: Icon(LineIcons.trash, color: Styles.secondaryColor()))
                  ],
                ),
              )
            ],
          ))
        ],
      ),
    );
  }

  Widget _buildAvatar({required Notifications data}) {
    return Stack(
      children: [
        CircleAvatar(radius: 28, backgroundColor: AppUtil.fromRGBO(data.avatarColor), child: TextWidget.s30w400(data.title[0], color: Styles.lightColor())),
      ],
    );
  }
}
