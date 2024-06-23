import 'package:flutter/material.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/guest/widgets/guest_widget_event.dart';

enum GuestStatus { none, show, hide }

class GuestWidgetController extends GuestWidgetEvent {
  final String idGuestWidget = 'idGuestWidget';

  GuestWidgetController() {
    setInit(this);
  }

  Future<void> setStatus({required GuestStatus status, int durationMs = 1, Function? callback}) async {
    Future.delayed(Duration(milliseconds: durationMs), () async {
      if (this.status == status) return;
      this.status = status;
      if (callback != null) callback();
      await rebuild();
    });
  }

  Future<void> hide() async {
    await setStatus(status: GuestStatus.hide);
    Future.delayed(const Duration(milliseconds: 300), () async {
      await setStatus(status: GuestStatus.none);
    });
  }

  Future<void> rebuild() async => update([idGuestWidget]);
  BorderSide getBorderSide(Users data) => BorderSide.none;
}
