import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/guest/guest.dart';
import 'package:kitakits/plugins/guest/widgets/guest_widget_controller.dart';

class GuestWidgetEvent extends Guest {
  late final GuestWidgetController _controller;
  GuestStatus status = GuestStatus.none;
  String name = '::GuestWidgetEvent';

  Future<void> setInit(GuestWidgetController controller) async {
    _controller = controller;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withChatWidgetService();
    await _withPositionService();
    await _withUsersModel();
    await _withLocationWidgetService();
    await _withGmapController();
    await _withFriendsModel();
  }

  Future<void> _withChatWidgetService() async {
    await on(chatWidgetService.onShow, () async {
      pr(name, 'chatWidgetService.onShow');
      await _controller.setStatus(status: GuestStatus.show);
      await set(guestService.onSettledGuest);
    }, priority: 25);
  }

  Future<void> _withPositionService() async {
    await on(travelsService.onStoppedPositionListen, () async {
      pr(name, 'travelsService.onStoppedPositionListen');
      await _controller.hide();
    }, priority: 1);
  }

  Future<void> _withUsersModel() async {
    await on(usersModel.onIconUpdated, () async {
      pr(name, 'usersModel.onIconUpdated');
      await _controller.rebuild();
    });
  }

  Future<void> _withFriendsModel() async {
    await on(friendsModel.onLeftEvent, () async {
      pr(name, 'friendsModel.onLeftEvent');
      await _controller.hide();
    });

    await on(friendsModel.onUpdatedProfile, () async {
      pr(name, 'friendsModel.onUpdatedProfile');
      await _controller.rebuild();
    }, priority: 10);
  }

  Future<void> _withLocationWidgetService() async {
    await on(locationWidgetService.onTapLocation, () async {
      pr(name, 'locationWidgetService.onTapLocation');
      await onPressedGuest(usersModel.data);
    });
  }

  Future<void> _withGmapController() async {
    await on(gmapController.marker.onTap, () async {
      pr(name, 'gmapController.marker.onTap');
      await _controller.rebuild();
    }, priority: 3);
  }

  Future<void> onPressedGuest(Users data) async {
    guestService.setSelected(data);
    await _controller.rebuild();
    await set(guestService.onSelectedGuest);
  }
}
