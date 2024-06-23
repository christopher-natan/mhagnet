import 'package:kitakits/plugins/snackbar/services/snackbar_service.dart';
import 'package:kitakits/plugins/snackbar/snackbar.dart';

class SnackbarServiceEvent extends Snackbar {
  late SnackbarService _service;
  String name = '::SnackbarServiceEvent';

  Future<void> setInit(SnackbarService service) async {
    _service = service;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withFriendsModel();
    await _withMessagesModel();
    await _withUsersModel();
    await _witNavigationWidgetService();
    await _witAdService();
    await _witJointService();
    await _witTravelService();
  }

  Future<void> _withFriendsModel() async {
    await on(friendsModel.onJoinEvent, () async {
      pr(name, 'friendsModel.onJoinEvent');
      await _service.showJoinEvent();
    });

    await on(friendsModel.onLeftEvent, () async {
      pr(name, 'friendsModel.onLeftEvent');
      await _service.showLeftEvent();
    });

    await on(friendsModel.onPositionChangedError, () async {
      pr(name, 'friendsModel.onPositionChangedError');
      await _service.showCanNotGetLocation();
    });
  }

  Future<void> _withUsersModel() async {
    await on(usersModel.onPositionUpdatedError, () async {
      pr(name, 'usersModel.onPositionUpdatedError');
      await _service.showCanNotGetLocation();
    });

    await on(usersModel.onDetailsUpdated, () async {
      pr(name, 'usersModel.onDetailsUpdated');
      await _service.showOnDetailsUpdated();
    });

    await on(usersModel.onIconUpdated, () async {
      pr(name, 'usersModel.onIconUpdated');
      await _service.showOnDetailsUpdated();
    });

    await on(usersModel.onLogoutGoogleUser, () async {
      pr(name, 'usersModel.onLogoutGoogleUser');
      await _service.showOnLogoutGoogleUser();
    });
  }

  Future<void> _withMessagesModel() async {
    await on(messagesModel.onNotSent, () async {
      pr(name, 'messagesModel.onNotSent');
      await _service.showMessageNotSent();
    });
  }

  Future<void> _witNavigationWidgetService() async {
    await on(navigationWidgetService.onDriveMode, () async {
      pr(name, 'navigationWidgetService.onDriveMode');
      await _service.showDriveModeOnOff(settingsModel.data.isDriveMode);
    });

    await on(navigationWidgetService.onFollow, () async {
      pr(name, 'navigationWidgetService.onFollow');
      await _service.showFollowOnOff(settingsModel.data.isFollow);
    });

    await on(navigationWidgetService.onEstimate, () async {
      pr(name, 'navigationWidgetService.onEstimate');
      await _service.showPolylineOnOff(settingsModel.data.isPolyline);
    });
  }

  Future<void> _witAdService() async {
    await on(admobService.onAdServedRewarded, () async {
      pr(name, 'adService.onAdServedRewarded');
      await _service.showAdServed();
    }, priority: 15);
  }

  Future<void> _witTravelService() async {
    await on(travelsService.onWentBeyond, () async {
      pr(name, 'travelsService.onWentBeyond');
      await _service.showOnWentBeyond();
    });
  }

  Future<void> _witJointService() async {
    await on(joinsService.onSocialError, () async {
      pr(name, 'joinsService.onSocialError');
      await _service.showSocialError();
    });
  }
}
