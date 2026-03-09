<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, Camera, ImagePlus, RotateCcw, ChevronRight, Loader2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { uploadedCardSetValues } from '@/stores/uploaded-card.svelte';
  import { m } from '@/paraglide/messages';
  import { compressImage, dataUrlToBase64, detectBarcode } from '$lib/utils/image-utils';
  import { extractGiftCardFromImages } from '$lib/utils/ai-client';
  import { toast } from 'svelte-sonner';
  import { logger } from '@/utils/logger';
  import { PUBLIC_IS_MODEL_AVAILABLE } from '$env/static/public';

  type Step = 'front' | 'back' | 'processing';

  let currentStep = $state<Step>('front');
  let frontImageUrl = $state('');
  let backImageUrl = $state('');
  let isProcessing = $state(false);

  let cameraInputRef: HTMLInputElement;
  let galleryInputRef: HTMLInputElement;

  const isModelAvailable = PUBLIC_IS_MODEL_AVAILABLE === 'true';

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  }

  function openCamera() {
    if (cameraInputRef) {
      cameraInputRef.value = '';
      cameraInputRef.click();
    }
  }

  function openGallery() {
    if (galleryInputRef) {
      galleryInputRef.value = '';
      galleryInputRef.click();
    }
  }

  async function handleFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      // Compress for better performance
      const compressed = await compressImage(rawDataUrl, 1200, 0.85);

      if (currentStep === 'front') {
        frontImageUrl = compressed;
      } else if (currentStep === 'back') {
        backImageUrl = compressed;
      }
    };
    reader.readAsDataURL(file);
  }

  function retakePhoto() {
    if (currentStep === 'front') {
      frontImageUrl = '';
    } else if (currentStep === 'back') {
      backImageUrl = '';
    }
  }

  function goToBackStep() {
    currentStep = 'back';
  }

  async function processCards() {
    currentStep = 'processing';
    isProcessing = true;

    try {
      const frontBase64 = dataUrlToBase64(frontImageUrl);
      const backBase64 = backImageUrl ? dataUrlToBase64(backImageUrl) : undefined;

      // Run barcode detection on both images in parallel
      const [frontBarcode, backBarcode] = await Promise.all([
        detectBarcode(frontImageUrl),
        backImageUrl ? detectBarcode(backImageUrl) : Promise.resolve(''),
      ]);
      const detectedBarcode = backBarcode || frontBarcode;
      logger.info('Detected barcode:', detectedBarcode);

      if (isModelAvailable) {
        // Vision-based extraction
        const aiResult = await extractGiftCardFromImages(frontBase64, backBase64);

        if (aiResult.success && aiResult.data) {
          uploadedCardSetValues({
            brandNameValue: aiResult.data.brandName,
            balanceValue: aiResult.data.balance,
            barcodeValue: aiResult.data.barcode || detectedBarcode,
            pinValue: aiResult.data.pin,
            frontImageData: frontImageUrl,
            backImageData: backImageUrl,
            imageUrlData: frontImageUrl,
            isLoading: false,
          });
          toast.success('Gift card details extracted!');
          goto('/wallet/upload-card');
          return;
        } else {
          logger.error('AI vision extraction failed:', aiResult.error);
          toast.error('Could not extract details automatically. Please enter them manually.');
        }
      }

      // Fallback: navigate with images and barcode only
      uploadedCardSetValues({
        barcodeValue: detectedBarcode,
        frontImageData: frontImageUrl,
        backImageData: backImageUrl,
        imageUrlData: frontImageUrl,
        isLoading: false,
      });
      goto('/wallet/upload-card');
    } catch (error) {
      logger.error('Error processing gift card images:', error);
      toast.error('Something went wrong. Please try again.');
      currentStep = 'front';
      isProcessing = false;
    }
  }

  function skipBackImage() {
    processCards();
  }
</script>

<div class="flex min-h-screen flex-col bg-background">
  <!-- Header -->
  <div
    class="sticky top-0 z-10 flex items-center justify-between bg-nav px-4 py-3 text-nav-foreground shadow"
  >
    <button
      onclick={() => {
        if (currentStep === 'back') {
          currentStep = 'front';
        } else {
          history.back();
        }
      }}
      class="flex items-center"
    >
      <ArrowLeft class="h-6 w-6" />
    </button>
    <span class="flex-1 text-center text-lg font-bold">{m['upload_card.title']()}</span>
    <div class="w-6"></div>
  </div>

  <!-- Step Indicator -->
  {#if currentStep !== 'processing'}
    <div class="flex items-center justify-center gap-2 px-6 pt-5 pb-2">
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold {currentStep === 'front'
          ? 'bg-primary text-primary-foreground'
          : 'bg-primary/20 text-primary'}"
      >
        1
      </div>
      <div class="h-0.5 w-10 rounded {currentStep === 'back' ? 'bg-primary' : 'bg-muted'}"></div>
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold {currentStep === 'back'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'}"
      >
        2
      </div>
    </div>
  {/if}

  <!-- Content -->
  <div class="flex flex-1 flex-col items-center px-6 py-4">
    {#if currentStep === 'processing'}
      <!-- Processing State -->
      <div class="flex flex-1 flex-col items-center justify-center gap-6">
        <div class="relative">
          <div
            class="h-20 w-20 animate-spin rounded-full border-4 border-muted border-t-primary"
          ></div>
        </div>
        <div class="text-center">
          <p class="text-lg font-semibold text-foreground">{m['upload_card.processing']()}</p>
          <p class="mt-1 text-sm text-muted-foreground">{m['upload_card.processing_hint']()}</p>
        </div>

        <!-- Show captured images during processing -->
        <div class="flex gap-3 pt-4">
          {#if frontImageUrl}
            <div class="overflow-hidden rounded-xl shadow-sm">
              <img src={frontImageUrl} alt="Front" class="h-24 w-36 object-cover opacity-60" />
              <p class="bg-muted/50 py-1 text-center text-xs text-muted-foreground">
                {m['upload_card.step_front']()}
              </p>
            </div>
          {/if}
          {#if backImageUrl}
            <div class="overflow-hidden rounded-xl shadow-sm">
              <img src={backImageUrl} alt="Back" class="h-24 w-36 object-cover opacity-60" />
              <p class="bg-muted/50 py-1 text-center text-xs text-muted-foreground">
                {m['upload_card.step_back']()}
              </p>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <!-- Step Title -->
      <h2 class="mb-1 text-lg font-semibold text-foreground">
        {currentStep === 'front' ? m['upload_card.step_front']() : m['upload_card.step_back']()}
      </h2>
      <p class="mb-6 text-center text-sm text-muted-foreground">
        {currentStep === 'front'
          ? m['upload_card.front_instruction']()
          : m['upload_card.back_instruction']()}
      </p>

      <!-- Image Preview Area -->
      {#if (currentStep === 'front' && frontImageUrl) || (currentStep === 'back' && backImageUrl)}
        <div class="relative mb-6 w-full max-w-sm">
          <img
            src={currentStep === 'front' ? frontImageUrl : backImageUrl}
            alt={currentStep === 'front' ? 'Front of card' : 'Back of card'}
            class="w-full rounded-2xl shadow-lg"
          />
          <!-- Retake button overlay -->
          <button
            onclick={retakePhoto}
            class="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <RotateCcw class="h-3.5 w-3.5" />
            {m['upload_card.retake']()}
          </button>
        </div>

        <!-- Action Buttons -->
        {#if currentStep === 'front'}
          <Button
            class="flex w-full max-w-sm items-center justify-center gap-2 rounded-full py-6 text-base font-semibold"
            onclick={goToBackStep}
          >
            {m['upload_card.next_step']()}
            <ChevronRight class="h-5 w-5" />
          </Button>
        {:else}
          <Button
            class="flex w-full max-w-sm items-center justify-center gap-2 rounded-full py-6 text-base font-semibold"
            onclick={processCards}
          >
            {m['upload_card.extract_now']()}
            <ChevronRight class="h-5 w-5" />
          </Button>
        {/if}
      {:else}
        <!-- Empty state: capture buttons -->
        <div
          class="mb-8 flex h-52 w-full max-w-sm items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20"
        >
          <div class="text-center text-muted-foreground/50">
            {#if currentStep === 'front'}
              <Camera class="mx-auto mb-2 h-12 w-12" />
            {:else}
              <ImagePlus class="mx-auto mb-2 h-12 w-12" />
            {/if}
            <p class="text-sm">
              {currentStep === 'front' ? m['upload_card.step_front']() : m['upload_card.step_back']()}
            </p>
          </div>
        </div>

        <!-- Capture Options -->
        <div class="flex w-full max-w-sm flex-col gap-3">
          {#if isMobileDevice()}
            <Button
              variant="default"
              class="flex items-center justify-center gap-2 rounded-full py-6 text-base font-semibold"
              onclick={openCamera}
            >
              <Camera class="h-5 w-5" />
              {m['upload_card.take_photo']()}
            </Button>
          {/if}
          <Button
            variant={isMobileDevice() ? 'outline' : 'default'}
            class="flex items-center justify-center gap-2 rounded-full py-6 text-base font-semibold"
            onclick={openGallery}
          >
            <ImagePlus class="h-5 w-5" />
            {m['upload_card.choose_gallery']()}
          </Button>
        </div>

        <!-- Skip back option -->
        {#if currentStep === 'back'}
          <button
            onclick={skipBackImage}
            class="mt-4 text-sm text-muted-foreground underline transition-colors hover:text-foreground"
          >
            {m['upload_card.skip_back']()}
          </button>
        {/if}
      {/if}
    {/if}
  </div>

  <!-- Hidden file inputs -->
  <input
    type="file"
    bind:this={cameraInputRef}
    class="hidden"
    onchange={handleFileSelected}
    accept="image/*"
    capture="environment"
  />
  <input
    type="file"
    bind:this={galleryInputRef}
    class="hidden"
    onchange={handleFileSelected}
    accept="image/*"
  />
</div>
