import ExpoModulesCore
import SwiftUI
// Ensure you have added the 'ExpoUI' dependency to your podspec
import ExpoUI 

// 1. Define your props class
final class LiquidGlassViewProps: UIBaseViewProps {}

// 2. Update your SwiftUI view
struct LiquidGlassView: ExpoSwiftUI.View {
    @ObservedObject public var props: LiquidGlassViewProps
    
    var body: some View {
        if #available(iOS 26.0, *) {
            // Wrapping in a container enables the "liquid" merging behavior
            GlassEffectContainer {
                Children()
                .glassEffect(.clear.interactive(), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            }
        } else {
            Children()
        }
    }
}
