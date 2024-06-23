import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/search/pages/search_page_controller.dart';
import 'package:kitakits/plugins/widgets/custom/text_widget.dart';
import 'package:kitakits/styles.dart';
import 'package:line_icons/line_icons.dart';

class SearchPage extends GetResponsiveView<SearchPageController> {
  SearchPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetBuilder<SearchPageController>(
        id: controller.idSearch,
        builder: (instance) {
          return Scaffold(
              resizeToAvoidBottomInset: false, backgroundColor: Styles.primaryColor(), body: SafeArea(child: Stack(children: [_buildContent(instance), _buildHeader(instance)])));
        });
  }

  Widget _buildHeader(SearchPageController instance) {
    return Padding(
        padding: const EdgeInsets.only(top: 15, left: 10, right: 10),
        child: Row(mainAxisAlignment: MainAxisAlignment.start, crossAxisAlignment: CrossAxisAlignment.center, children: [
          Container(
            color: Colors.transparent,
            width: 30,
            child: InkWell(child: const Icon(LineIcons.times, color: Colors.black), onTap: () => instance.onClickBackButton()),
          ),
          _buildSearch(instance),
        ]));
  }

  Widget _buildSearch(SearchPageController instance) {
    Widget container = AnimatedContainer(
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(30.0), color: Styles.darkColor()),
        width: Get.width - 65,
        duration: const Duration(milliseconds: 800),
        curve: Curves.fastOutSlowIn,
        child: GestureDetector(
            onTap: () => {},
            child: Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Stack(children: [
                  TextFormField(
                    style: TextStyle(color: Styles.lightColor(), fontSize: 14),
                    controller: instance.textEditingController,
                    focusNode: instance.focusNode,
                    onChanged: (value) => instance.onChangedSearch(value),
                    decoration: InputDecoration(
                      prefixIcon: Icon(LineIcons.search, size: 25, color: Styles.lightColor()),
                      border: InputBorder.none,
                      hintStyle: TextStyle(color: Colors.grey.withOpacity(0.6), fontSize: 15),
                      counterText: "",
                    ),
                    autofocus: instance.isAutofocus,
                    enabled: instance.isEnabled,
                  ),
                  _buildLoader(instance)
                ]))));
    return Container(margin: const EdgeInsets.only(left: 10), child: container);
  }

  Widget _buildContent(SearchPageController instance) {
    Widget animatedContainer = AnimatedContainer(
        margin: const EdgeInsets.only(top: 0),
        duration: const Duration(milliseconds: 10),
        height: Get.height,
        child: ClipRRect(
            child: Align(
                alignment: Alignment.topCenter,
                child: Container(
                  padding: const EdgeInsets.only(top: 80, bottom: 30),
                  color: Colors.white,
                  child: _buildList(instance),
                ))));

    return GestureDetector(onTap: () => instance.onPressedPage(), child: animatedContainer);
  }

  Widget _buildList(SearchPageController instance) {
    return GetBuilder<SearchPageController>(
        id: instance.idResults,
        builder: (instance) {
          dynamic places = instance.places;
          if (places == null) return Container();
          return ListView.separated(
              shrinkWrap: false,
              itemCount: places.length,
              itemBuilder: (context, index) {
                dynamic place = places[index];
                return Padding(
                    padding: const EdgeInsets.only(left: 10, right: 10),
                    child: ListTile(
                        title: TextWidget.s16w600(place['name']),
                        subtitle: SizedBox(
                          height: 20,
                          child: TextWidget.s12w600(place['formatted_address']),
                        ),
                        onTap: () => instance.onPressedResult(place)));
              },
              separatorBuilder: (context, index) => Divider(height: 0.1, color: Colors.grey.withOpacity(0.5)));
        });
  }

  Widget _buildLoader(SearchPageController instance) {
    if (!instance.isSearching) return const SizedBox();
    return Positioned(
        right: 20,
        child: SizedBox(
            height: 40,
            child: SpinKitThreeBounce(
              color: Styles.lightColor(),
              size: 15.0,
            )));
  }
}
