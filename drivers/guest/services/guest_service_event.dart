import 'package:get/get.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/guest/guest.dart';
import 'package:kitakits/plugins/guest/services/guest_service.dart';

class GuestServiceEvent extends Guest {
  late GuestService _service;
  final RxString onSelectedGuest = ''.obs;
  final RxString onSettledGuest = ''.obs;
  late Users selected = Users.toInit();

  bool friendLeft = false;
  String name = '::GuestServiceEvent';

  Future<void> setInit(GuestService service) async {
    _service = service;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _oncePositionChanged();
    await _withGmapController();
    await _withFriendsModel();
  }

  Future<void> _withGmapController() async {
    await on(gmapController.marker.onTap, () async {
      pr(name, 'gmapController.marker.onTap');
      String tappedId = gmapController.marker.getTappedId();
      if (tappedId == usersModel.data.userId) selected = usersModel.data;
      if (tappedId == friendsModel.data.userId) selected = friendsModel.data;
      if (tappedId != eventsModel.data.eventId) {
        await set(onSelectedGuest);
      } else {
        await set(navigationWidgetService.onTapDestinationMarker);
      }
    });
  }

  Future<void> _oncePositionChanged() async {
    await on(usersModel.onPositionChanged, () async {
      if (guestService.isUserSelected()) selected.position = usersModel.data.position;
    });
    await on(friendsModel.onPositionChanged, () async {
      if (guestService.isFriendSelected()) selected.position = friendsModel.data.position;
    });
  }

  Future<void> _withFriendsModel() async {
    await on(friendsModel.onFound, () async {
      pr(name, 'friendsModel.onFound');
      guestService.setSelected(friendsModel.data);
    }, priority: 1);
  }
}
