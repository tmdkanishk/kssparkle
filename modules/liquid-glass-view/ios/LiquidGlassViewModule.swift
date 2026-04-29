import ExpoModulesCore
import ExpoUI 

public class LiquidGlassViewModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LiquidGlassViewModule")
        // Use ExpoUIView for SwiftUI-based views
        ExpoUIView(LiquidGlassView.self)
    }
}