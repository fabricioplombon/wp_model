<?php
/**
 *
 * @package WordPress
 * @subpackage Modelo
 * @since Modelo
 */

get_header(); ?>

	<?php 
		while ( have_posts() ) : the_post();
	?>

	

	<?php 
		endwhile;
	?>

	

<?php get_footer(); ?>	