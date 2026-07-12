export {};

/**
 * Represents the input video file.
 *
 * This class stores basic information about the source file and provides
 * helper methods for extracting the filename and extension.
 */
class VideoFile {
  constructor(public readonly filename: string) {}

  /**
   * Returns the file extension without the leading period.
   *
   * Example:
   * "lecture.mov" -> "mov"
   */
  getExtension(): string {
    const lastDotIndex = this.filename.lastIndexOf('.');

    if (lastDotIndex === -1) {
      throw new Error(
        `The file "${this.filename}" does not have an extension.`,
      );
    }

    return this.filename.substring(lastDotIndex + 1).toLowerCase();
  }

  /**
   * Returns the filename without its extension.
   *
   * Example:
   * "lecture.mov" -> "lecture"
   */
  getBaseName(): string {
    const lastDotIndex = this.filename.lastIndexOf('.');

    if (lastDotIndex === -1) {
      return this.filename;
    }

    return this.filename.substring(0, lastDotIndex);
  }
}

/**
 * Represents a video codec.
 *
 * Different codec implementations provide different output formats.
 */
interface VideoCodec {
  getName(): string;
  getFileExtension(): string;
}

/**
 * Codec used to create MP4 video files.
 */
class Mp4Codec implements VideoCodec {
  getName(): string {
    return 'H.264 / MP4';
  }

  getFileExtension(): string {
    return 'mp4';
  }
}

/**
 * Codec used to create WebM video files.
 */
class WebMCodec implements VideoCodec {
  getName(): string {
    return 'VP9 / WebM';
  }

  getFileExtension(): string {
    return 'webm';
  }
}

/**
 * Creates the appropriate codec based on the requested output format.
 */
class CodecFactory {
  createCodec(outputFormat: string): VideoCodec {
    switch (outputFormat.toLowerCase()) {
      case 'mp4':
        return new Mp4Codec();

      case 'webm':
        return new WebMCodec();

      default:
        throw new Error(`Unsupported output format: "${outputFormat}".`);
    }
  }
}

/**
 * Represents raw video data after decoding.
 *
 * In a real application, this object might contain video frames,
 * audio samples, timestamps, and metadata.
 */
class DecodedVideo {
  constructor(
    public readonly sourceFilename: string,
    public readonly data: string,
  ) {}
}

/**
 * Represents video data after it has been resized.
 */
class ResizedVideo {
  constructor(
    public readonly sourceFilename: string,
    public readonly data: string,
    public readonly width: number,
    public readonly height: number,
  ) {}
}

/**
 * Represents encoded video data that is ready to be saved.
 */
class EncodedVideo {
  constructor(
    public readonly data: string,
    public readonly codec: VideoCodec,
  ) {}
}

/**
 * Reads and decodes the source video.
 */
class VideoDecoder {
  decode(videoFile: VideoFile): DecodedVideo {
    const sourceFormat = videoFile.getExtension();

    console.log(
      `Decoding "${videoFile.filename}" from ${sourceFormat.toUpperCase()} format...`,
    );

    // This string represents decoded video data for demonstration purposes.
    const decodedData = `decoded-data-from-${videoFile.filename}`;

    return new DecodedVideo(videoFile.filename, decodedData);
  }
}

/**
 * Changes the resolution of decoded video data.
 */
class VideoResizer {
  resize(
    decodedVideo: DecodedVideo,
    width: number,
    height: number,
  ): ResizedVideo {
    if (width <= 0 || height <= 0) {
      throw new Error('Video width and height must both be greater than zero.');
    }

    console.log(`Resizing video to ${width}x${height}...`);

    // This string represents resized video data for demonstration purposes.
    const resizedData = `${decodedVideo.data}-resized-to-${width}x${height}`;

    return new ResizedVideo(
      decodedVideo.sourceFilename,
      resizedData,
      width,
      height,
    );
  }
}

/**
 * Encodes resized video data using a selected codec.
 */
class VideoEncoder {
  encode(resizedVideo: ResizedVideo, codec: VideoCodec): EncodedVideo {
    console.log(`Encoding video using ${codec.getName()}...`);

    // This string represents encoded binary data for demonstration purposes.
    const encodedData = `${resizedVideo.data}-encoded-with-${codec.getName()}`;

    return new EncodedVideo(encodedData, codec);
  }
}

/**
 * Writes encoded video data to an output file.
 */
class VideoFileWriter {
  save(encodedVideo: EncodedVideo, outputFilename: string): void {
    console.log(`Saving converted video as "${outputFilename}"...`);

    // A real implementation would write binary data to the file system.
    console.log(`Saved data: ${encodedVideo.data}`);
  }
}

/**
 * Generates a thumbnail from decoded video data.
 */
class ThumbnailGenerator {
  generate(decodedVideo: DecodedVideo, outputFilename: string): void {
    console.log(
      `Generating thumbnail "${outputFilename}" from "${decodedVideo.sourceFilename}"...`,
    );

    // A real implementation would extract a frame and save it as an image.
  }
}

/**
 * Extracts metadata from the original video.
 */
class VideoMetadataExtractor {
  extract(videoFile: VideoFile): Record<string, string | number> {
    console.log(`Extracting metadata from "${videoFile.filename}"...`);

    // Example metadata used only for this demonstration.
    return {
      filename: videoFile.filename,
      format: videoFile.getExtension(),
      durationInSeconds: 3600,
    };
  }
}

/**
 * CLIENT CODE
 *
 * There is no facade in this version.
 *
 * The client must understand:
 *
 * 1. Which subsystem objects must be created
 * 2. The correct order of operations
 * 3. Which intermediate result is passed to each object
 * 4. How to select a codec
 * 5. How to construct output filenames
 * 6. When metadata and thumbnails should be generated
 */
function convertVideoWithoutFacade(
  sourceFilename: string,
  outputFormat: string,
  width: number,
  height: number,
): string {
  console.log('Starting video conversion without a facade.');
  console.log('-------------------------------------------');

  /*
   * Step 1: Create the source video object.
   */
  const sourceVideo = new VideoFile(sourceFilename);

  /*
   * Step 2: Create all subsystem components manually.
   *
   * The client is directly coupled to every one of these classes.
   */
  const codecFactory = new CodecFactory();
  const decoder = new VideoDecoder();
  const resizer = new VideoResizer();
  const encoder = new VideoEncoder();
  const fileWriter = new VideoFileWriter();
  const thumbnailGenerator = new ThumbnailGenerator();
  const metadataExtractor = new VideoMetadataExtractor();

  /*
   * Step 3: Extract metadata from the original video.
   *
   * The client must know that metadata extraction should happen before
   * or independently of the conversion process.
   */
  const metadata = metadataExtractor.extract(sourceVideo);

  console.log('Video metadata:', metadata);

  /*
   * Step 4: Ask the codec factory for the correct output codec.
   *
   * The client must know that the requested output format cannot be
   * passed directly to the encoder. It must first be converted into
   * a VideoCodec object.
   */
  const outputCodec = codecFactory.createCodec(outputFormat);

  /*
   * Step 5: Decode the source video.
   *
   * The decoder returns an intermediate DecodedVideo object.
   */
  const decodedVideo = decoder.decode(sourceVideo);

  /*
   * Step 6: Generate a thumbnail.
   *
   * The client must know that thumbnail generation requires decoded
   * video data rather than encoded or resized video data.
   */
  const thumbnailFilename = `${sourceVideo.getBaseName()}-thumbnail.jpg`;

  thumbnailGenerator.generate(decodedVideo, thumbnailFilename);

  /*
   * Step 7: Resize the decoded video.
   *
   * The client must pass the result from the decoder into the resizer.
   */
  const resizedVideo = resizer.resize(decodedVideo, width, height);

  /*
   * Step 8: Encode the resized video.
   *
   * The client must pass both the resized data and the selected codec.
   */
  const encodedVideo = encoder.encode(resizedVideo, outputCodec);

  /*
   * Step 9: Construct the output filename.
   *
   * The client is responsible for knowing the naming convention and
   * obtaining the correct file extension from the codec.
   */
  const outputFilename =
    `${sourceVideo.getBaseName()}-converted.` + outputCodec.getFileExtension();

  /*
   * Step 10: Save the encoded video.
   */
  fileWriter.save(encodedVideo, outputFilename);

  console.log('-------------------------------------------');
  console.log('Video conversion completed.');
  console.log(`Output video: ${outputFilename}`);
  console.log(`Thumbnail: ${thumbnailFilename}`);

  return outputFilename;
}

/**
 * Example program entry point.
 */
function main(): void {
  try {
    const outputFilename = convertVideoWithoutFacade(
      'software-design-lecture.mov',
      'mp4',
      1920,
      1080,
    );

    console.log(`Application received output file: ${outputFilename}`);
  } catch (error: unknown) {
    /*
     * TypeScript treats caught values as unknown in strict mode.
     * We therefore check whether the value is actually an Error.
     */
    if (error instanceof Error) {
      console.error(`Conversion failed: ${error.message}`);
    } else {
      console.error('Conversion failed because of an unknown error.');
    }
  }
}

main();
