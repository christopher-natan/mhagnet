import 'dart:async';

import 'package:get/get.dart';
import 'package:kitakits/plugins/joins/joins.dart' as plugin;
import 'package:kitakits/plugins/joins/models/joins_model.dart';

class JoinsModelEvent extends plugin.Joins {
  late JoinsModel _model;
  final RxString onActivated = ''.obs;
  final RxString onSetToActivated = ''.obs;
  final RxString onDoesNotExist = ''.obs;
  final RxString onNotFound = ''.obs;
  final RxString onFound = ''.obs;
  final RxString onFoundActivated = ''.obs;
  final RxString onDistanceUnreachable = ''.obs;
  final RxString onCreditsInsufficient = ''.obs;
  final RxString onError = ''.obs;
  StreamSubscription<dynamic>? subscribeJoin;
  String name = '::JoinsModelEvent';

  Future<void> setInit(JoinsModel model) async {
    _model = model;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withUsersModel();
    await _withJoinElementService();
    await _withEventsModel();
    await _withPositionService();
  }

  Future<void> _withUsersModel() async {
    await on(usersModel.onSetData, () async {
      pr(name, 'usersModel.onSetData');
      await _model.setData(callbackNoEvent: () => set(eventsModel.onDoesNotExist));
    });
  }

  Future<void> _withJoinElementService() async {
    await on(joinElementService.onTapJoin, () async {
      pr(name, 'joinElementService.onTapJoin');
      await _model.find(joinId: joinElementService.joinId);
    });
  }

  Future<void> _withEventsModel() async {
    await on(eventsModel.onCreated, () async {
      pr(name, 'eventsModel.onCreated');
      await _model.setToActivated();
    });
  }

  Future<void> _withPositionService() async {
    await on(travelsService.onStoppedPositionListen, () async {
      pr(name, 'travelsService.onStoppedPositionListen');
      await _model.setEmptyData();
    }, priority: 10);
  }
}
