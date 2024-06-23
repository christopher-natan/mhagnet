import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:kitakits/configs.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/credits/credits_configs.dart';
import 'package:kitakits/plugins/joins/models/joins_model_event.dart';
import 'package:kitakits/utils/app_util.dart';
import 'package:kitakits/utils/map_util.dart';

class Joins {
  static String tableName = 'joins';
  String joinId;
  String activityId;
  String eventId;
  String userId;
  dynamic destination;
  bool isActivated;
  int created;

  Joins({required this.joinId, required this.activityId, required this.eventId, required this.userId, required this.destination, required this.isActivated, required this.created});

  Joins.fromJson(dynamic json)
      : joinId = json['joinId'],
        activityId = json['activityId'],
        eventId = json['eventId'],
        userId = json['userId'],
        destination = json['destination'],
        isActivated = json['isActivated'],
        created = json['created'];

  dynamic toJson() =>
      {'joinId': joinId, 'activityId': activityId, 'eventId': eventId, 'userId': userId, 'destination': destination, 'isActivated': isActivated, 'created': created};

  static Joins toInit() => Joins(joinId: '', activityId: '', eventId: '', userId: '', destination: {}, isActivated: false, created: 0);
}

class JoinsModel extends JoinsModelEvent {
  Joins data = Joins.toInit();

  JoinsModel() {
    setInit(this);
  }

  Future<void> setData({required Function callbackNoEvent}) async {
    if (_hasUserNoJoinId()) return await callbackNoEvent();

    DocumentReference<Object?>? reference = collectionService.specificJoin(joinId: usersModel.data.joinId);
    Future<void> andThen(DocumentSnapshot<Object?> snapshot) async {
      dynamic result = snapshot.data();
      if (result == null) return await set(onDoesNotExist);
      data = Joins.fromJson(result);
      if (_hasNotActivated()) {
        await _listen();
        return await callbackNoEvent();
      } else {
        await eventsModel.setData();
      }
    }

    return await _runTransactionGet(reference: reference, callback: (snapshot) => andThen(snapshot));
  }

  Future<void> create({required Function callback}) async {
    Users userData = usersModel.data;
    data = Joins(
        joinId: userData.joinId,
        userId: userData.userId,
        activityId: userData.activityId,
        eventId: userData.eventId,
        destination: userData.destination,
        isActivated: false,
        created: AppUtil.getCurrentTimestamp());
    DocumentReference<Object?>? joinReference = collectionService.specificJoin(joinId: data.joinId);
    Future<void> andThen() async {
      await callback();
      await _listen();
    }

    joinReference.set(data.toJson()).then((_) => andThen()).onError((error, stackTrace) async {
      await setError(onError, error);
    });
  }

  Future<void> find({required String joinId}) async {
    DocumentReference<Object?>? reference = collectionService.specificJoin(joinId: 'join-$joinId');
    Future<void> andThen(DocumentSnapshot<Object?> snapshot) async {
      dynamic result = snapshot.data();
      if (result == null) return await set(onNotFound);
      if (Joins.fromJson(result).isActivated) return await set(onFoundActivated);
      await _onFoundCheckDistanceAndCredits(result);
    }

    return await _runTransactionGet(reference: reference, callback: (snapshot) => andThen(snapshot));
  }

  Future<void> _onFoundCheckDistanceAndCredits(dynamic response) async {
    Joins result = Joins.fromJson(response);
    Map coordinates = result.destination['coordinates'];
    LatLng position = MapUtil.positionToLatLng(locationService.currentPosition);
    int credits = usersModel.data.credits;
    double distance = destinationService.getDistanceTraveled(lat1: position.latitude, lon1: position.longitude, lat2: coordinates['latitude'], lon2: coordinates['longitude']);
    if(AppUtil.toMeters(distance) > Configs.distancePinMaxInMeters) {
        return await set(onDistanceUnreachable);
    }
    if(credits < CreditsConfigs.creditsJoinerRequired) {
      return await set(onCreditsInsufficient);
    }
    data = result;
    await set(onFound);
  }

  Future<void> setToActivated() async {
    Map<String, dynamic> document = {};
    document['isActivated'] = true;
    DocumentReference<Object?>? reference = collectionService.specificJoin(joinId: data.joinId);
    Future<void> andThen() async {
      data.isActivated = document['isActivated'];
      await set(onSetToActivated);
    }

    return await runTransactionUpdate(reference: reference, document: document, callback: () => andThen());
  }

  Future<void> _runTransactionGet({required DocumentReference<Object?> reference, required Function callback}) async {
    return await FirebaseFirestore.instance.runTransaction((transaction) async => transaction
        .get(reference)
        .then((snapshot) async => await callback(snapshot))
        .timeout(Configs.firestoreTimeoutInSeconds)
        .onError((error, stackTrace) async => await setError(onError, error, stackTrace: stackTrace)));
  }

  Future<void> runTransactionUpdate({DocumentReference<Object?>? reference, required Map<String, dynamic> document, required Function callback}) async {
    return await FirebaseFirestore.instance
        .runTransaction((transaction) async => transaction.update(reference!, document))
        .then((snapshot) async => await callback())
        .timeout(Configs.firestoreTimeoutInSeconds)
        .onError((error, stackTrace) async => await setError(onError, error, stackTrace: stackTrace));
  }

  Future<void> _listen() async {
    DocumentReference<Object?> reference = collectionService.specificJoin(joinId: data.joinId);
    subscribeJoin = reference.snapshots().listen((event) async {
      dynamic result = event.data();
      if (result == null) return;
      data = Joins.fromJson(result);
      if (isActivated()) {
        await stopListen();
        set(onActivated);
      }
    })
      ..onError((error, stackTrace) async => await setError(onError, error, stackTrace: stackTrace));
  }

  Future<void> stopListen() async {
    if (subscribeJoin != null) await subscribeJoin!.cancel();
  }

  Future<void> delete({required String joinId}) async {
    data = Joins.toInit();
    DocumentReference<Object?>? joinReference = collectionService.specificJoin(joinId: joinId);
    await FirebaseFirestore.instance.runTransaction((transaction) async => transaction.delete(joinReference));
  }

  Future<void> setEmptyData() async => data = Joins.toInit();
  bool _hasUserNoJoinId() => usersModel.data.joinId.isEmpty;
  bool _hasNotActivated() => !data.isActivated;
  bool isActivated() => data.isActivated;
  bool hasData() => data.joinId.isNotEmpty;
  String getPlainJoinId() => data.joinId.replaceAll('join-', '');

  @override
  Future<void> onClose() async {}
}
