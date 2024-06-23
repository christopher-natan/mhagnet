import 'dart:async';

import 'package:kitakits/configs.dart';
import 'package:kitakits/plugins/joins/widgets/joins_widget_event.dart';

enum JoinsStatus { none, open, close }

class JoinsWidgetController extends JoinsWidgetEvent {
  final String idJoins = 'idJoins';

  JoinsWidgetController() {
    setInit(this);
  }

  Future<void> setStatus({required JoinsStatus status, int durationMs = 1}) async {
    Future.delayed(Duration(milliseconds: durationMs), () async {
      this.status = status;
      await rebuild();
    });
  }

  Future<void> open() async => await setStatus(status: JoinsStatus.open);
  Future<void> close() async => await setStatus(status: JoinsStatus.close);
  Future<void> remove() async => await setStatus(status: JoinsStatus.none);
  Future<void> rebuild() async {
    update([idJoins]);
  }

  Future<void> startTimer() async {
    timer = Timer(Duration(minutes: Configs.hookUpTimeWaitDurationInMinutes), () async {
      timer.cancel();
      await set(joinsService.onCanceled);
      await set(joinsService.onTimesUp);
    });
  }

  Future<void> stopTimer() async {
    if (timer.isActive) timer.cancel();
  }

  String getMessage(String msg) {
    msg = msg.replaceAll('[JOIN_CODE]', joinsModel.getPlainJoinId());
    return activitiesModel.getMsgRules(msg);
  }

}
