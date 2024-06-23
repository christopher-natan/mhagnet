import 'package:flutter/material.dart';
import 'package:flutter_animator/flutter_animator.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/search/widgets/search_widget_controller.dart' as s;
import 'package:kitakits/strings.dart';
import 'package:kitakits/styles.dart';
import 'package:line_icons/line_icons.dart';

class SearchWidget extends GetResponsiveView<s.SearchWidgetController> {
  SearchWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<s.SearchWidgetController>(
        id: controller.idSearch,
        builder: (instance) {
          if (instance.eventsModel.hasEvent()) return Container();
          if (instance.status == s.SearchStatus.none) return Container();
          if (instance.status == s.SearchStatus.hide) {
            return SlideOutLeft(preferences: const AnimationPreferences(offset: Duration(milliseconds: 0)), child: _buildContent(instance));
          }
          if (instance.status == s.SearchStatus.show) return SlideInLeft(preferences: const AnimationPreferences(offset: Duration(seconds: 0)), child: _buildContent(instance));
          return _buildContent(instance);
        });
  }

  Widget _buildContent(s.SearchWidgetController instance) {
    BorderRadius textBoxBorderRadius = BorderRadius.circular(30.0);

    Widget container = AnimatedContainer(
        decoration: BoxDecoration(borderRadius: textBoxBorderRadius, color: Styles.darkColor()),
        width: instance.state == s.SearchState.expanded ? Get.width - 65 : 49,
        duration: const Duration(milliseconds: 800),
        curve: Curves.fastOutSlowIn,
        child: GestureDetector(
            onTap: () => instance.onPressedKeywordText(),
            child: TextFormField(
              maxLength: 15,
              style: const TextStyle(color: Colors.white),
              controller: instance.textEditingController,
              focusNode: instance.focusNode,
              onChanged: (value) => instance.onChangedSearch(value),
              onTap: () => instance.onPressedKeywordText(),
              decoration: InputDecoration(
                prefixIcon: Icon(LineIcons.search, size: 25, color: Styles.specialColor()),
                border: InputBorder.none,
                hintStyle: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w400, color: Colors.white70),
                hintText: instance.focusNode!.hasFocus ? '' : Strings.msg("se88"),
                counterText: "",
              ),
              autofocus: instance.isAutoFocus,
              enabled: true,
            )));
    return Container(margin: const EdgeInsets.only(left: 10), child: container);
  }
}
