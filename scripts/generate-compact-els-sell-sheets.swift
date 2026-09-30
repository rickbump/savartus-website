import AppKit
import CoreGraphics
import Foundation
import ImageIO

struct TextBlock {
    let rect: CGRect
    let text: String?
    let fontSize: CGFloat
    let color: NSColor
    let fill: NSColor?
    let cornerRadius: CGFloat
    let centered: Bool

    init(
        rect: CGRect,
        text: String? = nil,
        fontSize: CGFloat = 11,
        color: NSColor = NSColor(calibratedRed: 0.07, green: 0.18, blue: 0.38, alpha: 1),
        fill: NSColor? = nil,
        cornerRadius: CGFloat = 0,
        centered: Bool = false
    ) {
        self.rect = rect
        self.text = text
        self.fontSize = fontSize
        self.color = color
        self.fill = fill
        self.cornerRadius = cornerRadius
        self.centered = centered
    }
}

let pageWidth: CGFloat = 612
let pageHeight: CGFloat = 792
let sourceWidth: CGFloat = 1102
let sourceHeight: CGFloat = 1427

func pageRect(from pixelRect: CGRect) -> CGRect {
    let scaleX = pageWidth / sourceWidth
    let scaleY = pageHeight / sourceHeight
    return CGRect(
        x: pixelRect.minX * scaleX,
        y: pageHeight - pixelRect.maxY * scaleY,
        width: pixelRect.width * scaleX,
        height: pixelRect.height * scaleY
    )
}

func loadImage(_ path: String) -> CGImage {
    let url = URL(fileURLWithPath: path)
    guard
        let source = CGImageSourceCreateWithURL(url as CFURL, nil),
        let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
    else {
        fatalError("Could not read sell-sheet page image: \(path)")
    }
    return image
}

func draw(_ blocks: [TextBlock], in context: CGContext) {
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)

    for block in blocks {
        let rect = pageRect(from: block.rect)
        if let fill = block.fill {
            let path = CGPath(
                roundedRect: rect,
                cornerWidth: block.cornerRadius,
                cornerHeight: block.cornerRadius,
                transform: nil
            )
            context.addPath(path)
            context.setFillColor(fill.cgColor)
            context.fillPath()
        }

        guard let text = block.text else { continue }
        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = block.centered ? .center : .left
        paragraph.lineBreakMode = .byWordWrapping
        let font = NSFont.systemFont(ofSize: block.fontSize, weight: .medium)
        let attributed = NSAttributedString(
            string: text,
            attributes: [
                .font: font,
                .foregroundColor: block.color,
                .paragraphStyle: paragraph,
            ]
        )
        attributed.draw(in: rect.insetBy(dx: 1, dy: 1))
    }

    NSGraphicsContext.restoreGraphicsState()
}

func createPDF(pages: [(String, [TextBlock])], outputPath: String, title: String) {
    var mediaBox = CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight)
    guard
        let consumer = CGDataConsumer(url: URL(fileURLWithPath: outputPath) as CFURL),
        let context = CGContext(consumer: consumer, mediaBox: &mediaBox, nil)
    else {
        fatalError("Could not create PDF: \(outputPath)")
    }

    for (imagePath, blocks) in pages {
        context.beginPDFPage(nil)
        context.draw(loadImage(imagePath), in: mediaBox)
        draw(blocks, in: context)
        context.endPDFPage()
    }
    context.closePDF()
    print("Wrote \(title): \(outputPath)")
}

func duplicate(_ source: String, to destination: String) throws {
    let manager = FileManager.default
    if manager.fileExists(atPath: destination) {
        try manager.removeItem(atPath: destination)
    }
    try manager.copyItem(atPath: source, toPath: destination)
}

guard CommandLine.arguments.count == 3 else {
    fatalError("Usage: swift generate-compact-els-sell-sheets.swift <source-pages-dir> <output-dir>")
}

let sourceDirectory = CommandLine.arguments[1]
let outputDirectory = CommandLine.arguments[2]
try FileManager.default.createDirectory(
    atPath: outputDirectory,
    withIntermediateDirectories: true
)

let blue = NSColor(calibratedRed: 0.04, green: 0.22, blue: 0.58, alpha: 1)
let paleBlue = NSColor(calibratedRed: 0.91, green: 0.96, blue: 0.99, alpha: 1)
let white = NSColor.white

let els150Front = "\(sourceDirectory)/ELS150 Sell sheet front.png"
let els150Back = "\(sourceDirectory)/ELS150 Sell sheet back.docx"
let els300Front = "\(sourceDirectory)/ELS300 Sell sheet front.docx"
let els300Back = "\(sourceDirectory)/ELS300 Sell sheet back.docx"

let els150Path = "\(outputDirectory)/Savartus_ELS150_Sell_Sheet.pdf"
createPDF(
    pages: [
        (
            els150Front,
            [
                TextBlock(
                    rect: CGRect(x: 48, y: 448, width: 502, height: 166),
                    text: "ELS150 keeps everyday organizational storage responsive with a disk cache server built into the 14U appliance. Each write is automatically burned to a second, write-once Blu-ray copy for durable, long-term preservation.",
                    fontSize: 12,
                    color: NSColor(calibratedRed: 0.25, green: 0.31, blue: 0.4, alpha: 1),
                    fill: white
                ),
            ]
        ),
        (
            els150Back,
            [
                TextBlock(
                    rect: CGRect(x: 66, y: 234, width: 271, height: 55),
                    text: "INTEGRATED CACHE SERVER",
                    fontSize: 11.5,
                    color: blue,
                    fill: paleBlue,
                    centered: true
                ),
                TextBlock(
                    rect: CGRect(x: 66, y: 389, width: 271, height: 126),
                    text: "Built into the ELS150 for everyday reads and writes. The cache server provides responsive file access while each write is automatically copied to write-once Blu-ray media.",
                    fontSize: 8.8,
                    color: NSColor(calibratedRed: 0.25, green: 0.31, blue: 0.4, alpha: 1),
                    fill: paleBlue
                ),
            ]
        ),
    ],
    outputPath: els150Path,
    title: "Savartus ELS150"
)
try duplicate(els150Path, to: "\(outputDirectory)/Savartus_ELS150_Sell_Sheet-1.pdf")

let els300Path = "\(outputDirectory)/Savartus_ELS300_Sell_Sheet.pdf"
createPDF(
    pages: [
        (
            els300Front,
            [
                TextBlock(
                    rect: CGRect(x: 43, y: 435, width: 500, height: 194),
                    text: "The ELS300 is an all-in-one organizational storage appliance with its cache server integrated in the same 7U chassis. Everyday access runs through the built-in cache, while each write is automatically burned to a second, write-once Blu-ray copy.",
                    fontSize: 11.5,
                    color: NSColor(calibratedRed: 0.25, green: 0.31, blue: 0.4, alpha: 1),
                    fill: white
                ),
                TextBlock(
                    rect: CGRect(x: 43, y: 644, width: 258, height: 118),
                    fill: paleBlue,
                    cornerRadius: 5
                ),
                TextBlock(
                    rect: CGRect(x: 55, y: 655, width: 234, height: 41),
                    text: "57.6 TB",
                    fontSize: 22,
                    color: blue,
                    centered: true
                ),
                TextBlock(
                    rect: CGRect(x: 55, y: 700, width: 234, height: 55),
                    text: "Maximum system capacity\n200 GB double-sided media",
                    fontSize: 9,
                    color: NSColor(calibratedRed: 0.25, green: 0.31, blue: 0.4, alpha: 1),
                    centered: true
                ),
            ]
        ),
        (
            els300Back,
            [
                TextBlock(
                    rect: CGRect(x: 46, y: 223, width: 704, height: 58),
                    text: "ELS300 is an all-in-one organizational appliance with its cache server integrated in the 7U chassis. Every write automatically creates a second, write-once optical copy.",
                    fontSize: 8.5,
                    color: NSColor(calibratedRed: 0.25, green: 0.31, blue: 0.4, alpha: 1),
                    fill: white
                ),
                TextBlock(
                    rect: CGRect(x: 143, y: 396, width: 176, height: 76),
                    text: "Integrated cache server\n(built into ELS300)",
                    fontSize: 9.5,
                    color: blue,
                    fill: paleBlue
                ),
                TextBlock(
                    rect: CGRect(x: 365, y: 696, width: 682, height: 44),
                    text: "Up to 200 GB per double-sided disc; 57.6 TB maximum system capacity with 288 discs.",
                    fontSize: 9.5,
                    color: NSColor(calibratedRed: 0.25, green: 0.31, blue: 0.4, alpha: 1),
                    fill: white
                ),
                TextBlock(
                    rect: CGRect(x: 365, y: 773, width: 682, height: 31),
                    text: "4 x 3.5 in drive bays; integrated cache server; XFS file system.",
                    fontSize: 8.5,
                    color: NSColor(calibratedRed: 0.25, green: 0.31, blue: 0.4, alpha: 1),
                    fill: white
                ),
            ]
        ),
    ],
    outputPath: els300Path,
    title: "Savartus ELS300"
)
try duplicate(els300Path, to: "\(outputDirectory)/Savartus_ELS300_Sell_Sheet-1.pdf")