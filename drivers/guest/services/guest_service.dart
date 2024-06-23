import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/guest/services/guest_service_event.dart';

class GuestService extends GuestServiceEvent {
  GuestService() {
    setInit(this);
  }

  List<Users> getGuestData() {
    List<Users> data = [];
    data.add(usersModel.data);
    data.add(friendsModel.data);
    return data;
  }

  Users setSelected(Users user) => selected = user;
  Users getSelected() => selected;
  bool isFriendSelected() {
    if (!gmapController.isReady || selected.userId == friendsModel.data.userId) return true;
    return false;
  }

  bool isUserSelected() {
    if (!gmapController.isReady || selected.userId == usersModel.data.userId) return true;
    return false;
  }

  bool isDestinationSelected() {
    if (!gmapController.isReady || navigationWidgetService.isDestinationCentered) return true;
    return false;
  }
}
