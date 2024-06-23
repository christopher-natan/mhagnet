import 'package:avatar_glow/avatar_glow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animator/flutter_animator.dart';
import 'package:get/get.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/guest/widgets/guest_widget_controller.dart';
import 'package:kitakits/utils/app_util.dart';

class GuestWidget extends GetResponsiveView<GuestWidgetController> {
  GuestWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetBuilder<GuestWidgetController>(
        id: controller.idGuestWidget,
        builder: (instance) {
          AnimationPreferences preferences = const AnimationPreferences(offset: Duration(milliseconds: 100));
          if (instance.status == GuestStatus.hide) return SlideOutLeft(preferences: preferences, child: _buildContent(instance));
          if (instance.status == GuestStatus.show) return SlideInLeft(preferences: preferences, child: _buildContent(instance));
          return Container();
        });
  }

  List<Widget> _buildGuestData(GuestWidgetController instance) {
    List<Widget> guest = [];
    instance.guestService.getGuestData().forEach((data) {
      if (data.icon != null) guest.add(_buildButton(data, instance));
      guest.add(const SizedBox(height: 17));
    });
    return guest;
  }

  Widget _buildContent(GuestWidgetController instance) {
    Widget padding =  Padding(
        padding: const EdgeInsets.all(2),
        child:  Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: _buildGuestData(instance)));

    return Container(
      width: 70,
      padding: const EdgeInsets.all(10),
      margin: const EdgeInsets.only(left: 5, top: 60),
      decoration:  BoxDecoration(
        borderRadius: const BorderRadius.all(Radius.circular(20)),
          color: Colors.black38.withOpacity(0.1)
      ),
      child: padding,
    );
  }

  Widget _buildButton(Users data, GuestWidgetController instance) {
    Widget widget = FittedBox(
        fit: BoxFit.fitHeight,
        child: ElevatedButton(
            onPressed: () => instance.onPressedGuest(data),
            style: ElevatedButton.styleFrom(
                shape: const CircleBorder(), fixedSize: const Size(55, 55), side: instance.getBorderSide(data), padding: EdgeInsets.zero),
            child: _buildIcon(data)));

    return AvatarGlow(
      startDelay: const Duration(milliseconds: 500),
      glowColor: Colors.red,
      glowShape: BoxShape.circle,
      animate: data.userId == instance.guestService.selected.userId,
      curve: Curves.fastOutSlowIn,
      glowRadiusFactor: 0.2,
      child: widget,
    );
  }

  Widget _buildIcon(Users data) {
    return AppUtil.getAvatarIcon(data.icon!);
  }
}
