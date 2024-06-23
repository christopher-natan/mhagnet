import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/snackbar/services/snackbar_service_event.dart';
import 'package:kitakits/plugins/widgets/custom/text_widget.dart';
import 'package:kitakits/strings.dart';
import 'package:kitakits/styles.dart';
import 'package:line_icons/line_icons.dart';
import 'package:top_snackbar_flutter/top_snack_bar.dart';

class SnackbarService extends SnackbarServiceEvent {
  SnackbarService() {
    setInit(this);
  }

  Future<void> _show(String message) async {
    showTopSnackBar(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        Overlay.of(Get.context!),
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: Colors.black87.withOpacity(0.6),
                  border: Border.all(
                    color: Colors.white54,
                    width: 0.5,
                  ),
                ),
                padding: const EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 10),
                width: Get.width - 23,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Icon(LineIcons.infoCircle, color: Colors.white),
                    const SizedBox(width: 5),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        TextWidget.s11w800(activitiesModel.getMsgRules(message), color: Styles.lightColor(), textAlign: TextAlign.center),
                      ],
                    )
                  ],
                ))
          ],
        ));
  }

  Future<void> showJoinEvent() async {
    String message = Strings.msg(Strings.msgFriendJoin).replaceAll(Strings.keyFriendName, friendsModel.data.name);
    await _show(message);
  }

  Future<void> showLeftEvent() async {
    String message = Strings.msg(Strings.msgFriendLeft).replaceAll(Strings.keyFriendName, friendsModel.data.name);
    await _show(message);
  }

  Future<void> showMessageNotSent() async {
    String message = Strings.msg("s90");
    await _show(message);
  }

  Future<void> showCanNotGetLocation() async {
    String message = Strings.msg("s91");
    await _show(message);
  }

  Future<void> showDriveModeOnOff(bool isOn) async {
    String message = isOn ? Strings.msg('snack101') : Strings.msg('snack102');
    await _show(message);
  }

  Future<void> showAdServed() async {
    String message = Strings.msg('snack103');
    await _show(message);
  }

  Future<void> showFollowOnOff(bool isOn) async {
    String message = isOn ? Strings.msg('snack104') : Strings.msg('snack105');
    await _show(message);
  }

  Future<void> showPolylineOnOff(bool isOn) async {
    String message = isOn ? Strings.msg('snack106') : Strings.msg('snack107');
    await _show(message);
  }

  Future<void> showOnLogoutGoogleUser() async {
    String message = Strings.msg('a53s');
    await _show(message);
  }

  Future<void> showOnDetailsUpdated() async {
    String message = Strings.msg('b1s');
    await _show(message);
  }

  Future<void> showSocialError() async {
    String message = Strings.msg('e113');
    await _show(message);
  }

  Future<void> showOnWentBeyond() async {
    String message = Strings.msg(Strings.msgWentBeyond).replaceAll(Strings.keySelectedUser, guestService.getSelected().name);
    await _show(message);
  }
}
